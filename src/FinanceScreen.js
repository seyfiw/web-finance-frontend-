import { Table, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Modal } from "antd";
import TransactionForm from "./components/TransactionForm";
import { message } from "antd";

const URL_TXACTIONS = "http://localhost:1337/api/txactions";

const FinanceScreen = () => {
	const [summaryAmount, setSummaryAmount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [transactionData, setTransactionData] = useState([]);

	const [openModal, setOpenModal] = useState(false);
	const [editForm, setEditForm] = useState({
		type: "",
		amount: "",
		note: "",
	});

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

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			const formattedData = data.data.map((item) => {
				const { id, attributes } = item;
				return {
					id,
					key: id,
					type: attributes.type,
					amount: parseFloat(attributes.amount.toString().replace(/,/g, "")),
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
		if (transactionData.length > 0) {
			const total = transactionData.reduce((sum, transaction) => {
				const amount = Number(transaction.amount) || 0;
				return transaction.type === "income" ? sum + amount : sum - amount;
			}, 0);
			setSummaryAmount(total);
		}
	}, [transactionData]);

	const columns = [
		{
			title: "วันที่",
			dataIndex: "action_datetime",
			key: "action_datetime",
			render: (date) => new Date(date).toLocaleDateString("th-TH"), // แปลงวันที่
		},
		{
			title: "ประเภท",
			dataIndex: "type",
			key: "type",
			render: (type) => (
				<Tag color={type === "income" ? "green" : "red"}>
					{type === "income" ? "รายรับ" : "รายจ่าย"}
				</Tag>
			),
		},
		{
			title: "จำนวนเงิน",
			dataIndex: "amount",
			key: "amount",
			align: "right", // จัดชิดขวา
			render: (amount) => `${Number(amount).toLocaleString()} บาท`, // แปลงจำนวนเงิน
		},
		{
			title: "รายละเอียด",
			dataIndex: "note",
			key: "note",
			render: (note) => note || "-",
		},
		{
			title: "",
			key: "action",
			align: "center",
			render: (text, record) => (
				<div className="flex justify-center">
					<button
						className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded "
						onClick={() => {
							setEditForm({
                id: record.id,
								type: record.type,
								amount: record.amount,
								note: record.note,
							});
              setOpenModal(true);
						}}
					>
						<FaEdit />
					</button>
				</div>
			),
		},
	];

	return (
		<>
			<div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-6">
				<div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
					{/* Header */}
					<div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8">
						<h1 className="text-4xl font-extrabold text-white text-center tracking-wide">
							ระบบบันทึกรายรับ-รายจ่าย
						</h1>
					</div>

					{/* Summary */}
					<div className="p-8">
						<div className="mb-8 text-center">
							<h2 className="text-2xl font-semibold text-gray-700">
								ยอดเงินคงเหลือ
							</h2>
							<p
								className={`text-5xl font-extrabold mt-4 ${
									summaryAmount >= 0 ? "text-green-500" : "text-red-500"
								}`}
							>
								{summaryAmount.toLocaleString()} บาท
							</p>
						</div>

						{/* Transaction List */}
						<div className="bg-gray-50 rounded-lg p-8 shadow-inner">
							<h3 className="text-xl font-semibold text-gray-700 mb-6">
								รายการธุรกรรมทั้งหมด
							</h3>
							<div className="flex justify-end mb-4">
								<button
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
									onClick={() => {
                    setEditForm({
											type: "",
											amount: "",
											note: "",
										});
										setOpenModal(true);
									}}
								>
									<FaPlus />
								</button>
							</div>
							<Table
								columns={columns}
								dataSource={transactionData} // ใช้ข้อมูลจาก props
								rowKey="id" // ใช้ `id` เป็น key สำหรับแถว
								pagination={{ pageSize: 10 }} // การแบ่งหน้า (5 รายการต่อหน้า)
								bordered // เพิ่มเส้นขอบให้ตาราง
							/>
						</div>
					</div>
				</div>
			</div>
			<FinanceModal
				open={openModal}
				setOpen={setOpenModal}
				editItem={editForm}
				setEditItem={setEditForm}
				fetchTransactions={fetchTransactions}
			/>
		</>
	);
};

const FinanceModal = ({
	open,
	setOpen,
	editItem,
	setEditItem,
	fetchTransactions,
}) => {
	const closeModal = () => {
		setOpen(false);
		setEditItem(null);
	};

	const onSubmit = async (values) => {
		try {
			if (editItem.id) {
				const response = await fetch(`${URL_TXACTIONS}/${editItem.id}`, {
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify({
						data: {
							type: values.type,
							amount: values.amount,
							note: values.note || "",
						},
					}),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				message.success("แก้ไขข้อมูลสำเร็จ");
			} else {
				const response = await fetch(URL_TXACTIONS, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify({
						data: {
							action_datetime: new Date().toISOString(), // ISO string ตามที่ Strapi รองรับ
							type: values.type, // ตัวอย่าง: "income" หรือ "expense"
							amount: values.amount, // จำนวนเงิน
							note: values.note || "", // รายละเอียด (สามารถเว้นว่างได้)
						},
					}),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				message.success("เพิ่มข้อมูลสำเร็จ");
			}
			fetchTransactions();
			closeModal();
		} catch (err) {
			console.error("Error fetching data:", err);
		}
	};

	return (
		<>
			<Modal
				visible={open}
				onCancel={closeModal}
				footer={null}
			>
				<div className="p-4">
					<TransactionForm
						setOpen={setOpen}
						open={open}
						editItem={editItem}
						onCancel={closeModal}
						onSubmit={onSubmit}
            initialValues={editItem}
					/>
				</div>
			</Modal>
		</>
	);
};

export default FinanceScreen;
