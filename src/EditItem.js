import React, { useEffect, useState } from 'react';

export default function EditItem({ isOpen, item, onItemEdited, onClose }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: 0,
    note: ''
  });

  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        type: item.type || 'expense',
        amount: item.amount || 0,
        note: item.note || ''
      });
    }
  }, [isOpen, item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.amount) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    onItemEdited(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">แก้ไขรายการ</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภท <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="income">รายรับ</option>
              <option value="expense">รายจ่าย</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จำนวนเงิน <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              className="w-full rounded-md border border-gray-300 p-2"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รายละเอียด
            </label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="เพิ่มรายละเอียด (ไม่บังคับ)"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}