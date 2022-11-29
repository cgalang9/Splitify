import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import EditPaymentForm from './EditPaymentForm';



function EditPaymentFormModal({ paymentId }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button className='edit_payment_btn' onClick={() => setShowModal(true)}>Edit Payment</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <EditPaymentForm closeModal={() => setShowModal(false)} paymentId={paymentId} />
        </Modal>
      )}
    </>
  );
}

export default EditPaymentFormModal;
