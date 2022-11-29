import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import AddPaymentForm from './AddPaymentForm';


function AddPaymentFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div><button onClick={() => setShowModal(true)} className='settle_up_btn'>Settle Up</button></div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <AddPaymentForm closeModal={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  );
}

export default AddPaymentFormModal;
