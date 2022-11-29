import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import AddExpenseForm from './AddExpenseForm';

function AddExpenseFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div><button onClick={() => setShowModal(true)} className='add_expense_btn'>Add an Expense</button></div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <AddExpenseForm  closeModal={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  );
}

export default AddExpenseFormModal;
