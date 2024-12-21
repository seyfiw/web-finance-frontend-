import React from "react";
import { Card, Form, Input, Select, Button } from "antd";
const { TextArea } = Input;

const TransactionForm = ({
	initialValues = {},
	onSubmit,
	onCancel,
	mode = "add",
}) => {
	const [form] = Form.useForm();

	React.useEffect(() => {
		form.setFieldsValue(initialValues);
	}, [form, initialValues]);

	const handleSubmit = (values) => {
		onSubmit(values);
	};

	return (
		<Card
			title={mode === "add" ? "เพิ่มรายการใหม่" : "แก้ไขรายการ"}
			className="max-w-lg mx-auto"
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				initialValues={initialValues}
			>
				<Form.Item
					name="type"
					label="ประเภท"
					rules={[{ required: true, message: "กรุณาเลือกประเภท" }]}
				>
					<Select>
						<Select.Option value="income">รายรับ</Select.Option>
						<Select.Option value="expense">รายจ่าย</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item
					name="amount"
					label="จำนวนเงิน"
					rules={[{ required: true, message: "กรุณาใส่จำนวนเงิน" }]}
				>
					<Input type="number" />
				</Form.Item>

				<Form.Item
					name="note"
					label="รายละเอียด"
				>
					<TextArea rows={4} />
				</Form.Item>

				<Form.Item>
					<div className="flex justify-end gap-2">
						<Button onClick={onCancel}>ยกเลิก</Button>
						<Button
							type="primary"
							htmlType="submit"
						>
							{mode === "add" ? "เพิ่มรายการ" : "บันทึกการแก้ไข"}
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default TransactionForm;
