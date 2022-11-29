import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import LoginFormT from './LoginFormT';
function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className='log-in-btn' >Log In</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <LoginFormT />
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;
