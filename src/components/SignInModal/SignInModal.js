import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn } from 'lucide-react';
import './SignInModal.css';

function SignInModal({ isOpen, onClose, onSignIn }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Unlock Full Capacity</h2>
            <p>Please sign in to save and access your notes and checklists across all your devices.</p>
            <div className="modal-actions">
              <button onClick={onSignIn} className="modal-signin-btn">
                <LogIn size={20} />
                <span>Sign In with Google</span>
              </button>
              <button onClick={onClose} className="modal-close-btn">
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SignInModal;