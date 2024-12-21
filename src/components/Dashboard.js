import React, { useState, useEffect } from "react";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";

const URL_TXACTIONS = "http://localhost:1337/api/txactions";

const Dashboard = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [transactionData, setTransactionData] = useState([]);
	const [distributionData, setDistributionData] = useState([]);

	const fetchTransactions = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(
				URL_TXACTIONS + "?sort=createdAt:desc&populate=*",
				{
					method: "GET",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			const data = await response.json();

			const formattedData = data.data.map((item) => {
				const { id, attributes } = item;
				return {
					id,
					type: attributes.type,
					amount: attributes.amount,
					note: attributes.note || "",
					action_datetime: attributes.action_datetime,
				};
			});

			setTransactionData(formattedData);
		} catch (err) {
			console.error("Error fetching data:", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	useEffect(() => {
		// คำนวณยอดรวมรายรับและรายจ่าย
		const totals = transactionData.reduce(
			(acc, transaction) => {
				if (transaction.type === "income") {
					acc.income += transaction.amount;
				} else {
					acc.expense += transaction.amount;
				}
				return acc;
			},
			{ income: 0, expense: 0 }
		);

		setDistributionData([
			{ name: "รายรับ", value: totals.income },
			{ name: "รายจ่าย", value: totals.expense },
		]);
	}, [transactionData]);

	const COLORS = ["#4CAF50", "#f44336"];

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen     flex items-center justify-center p-6 bg-gradient-to-b from-blue-100 to-white">
			<div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8">
					<h1 className="text-3xl font-extrabold text-white text-center tracking-wide">
						สัดส่วนรายรับ-รายจ่าย
					</h1>
				</div>

				{/* Content */}
				<div className="p-8">
					{/* Pie Chart Section */}
					<div className="bg-gray-50 rounded-2xl p-8 shadow-inner">
						<div className="h-[400px] w-full">
							<ResponsiveContainer
								width="100%"
								height="100%"
							>
								<PieChart>
									<Pie
										data={distributionData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, percent }) =>
											`${name} ${(percent * 100).toFixed(0)}%`
										}
										outerRadius={150}
										fill="#8884d8"
										dataKey="value"
									>
										{distributionData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip
										formatter={(value) => `${value.toLocaleString()} บาท`}
									/>
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>

						{/* Data Summary */}
						<div className="grid grid-cols-2 gap-6 mt-8">
							{distributionData.map((item, index) => (
								<div
									key={item.name}
									className={`p-6 rounded-xl shadow-lg transform transition hover:scale-105 ${
										index === 0
											? "bg-green-50 border-l-4 border-green-400"
											: "bg-red-50 border-l-4 border-red-400"
									}`}
								>
									<h3 className="text-xl font-semibold text-gray-700 mb-2">
										{item.name}
									</h3>
									<p
										className={`text-3xl font-bold ${
											index === 0 ? "text-green-600" : "text-red-600"
										}`}
									>
										{item.value.toLocaleString()} บาท
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
