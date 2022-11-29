import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import EditExpenseForm from './EditExpenseForm'


function EditExpenseFormModal({ expenseId }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button className='edit_expense_btn' onClick={() => setShowModal(true)}>Edit Expense</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <EditExpenseForm closeModal={() => setShowModal(false)} expenseId={expenseId} />
        </Modal>
      )}
    </>
  );
}

export default EditExpenseFormModal;
