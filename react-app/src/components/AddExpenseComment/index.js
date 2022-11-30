import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from '../../context/Modal';
import { addCommentExpenseThunk } from '../../store/expenses'
import './AddExpenseComment.css'


function AddExpenseCommentForm({ expense_id }) {
    const dispatch = useDispatch()

    const [text, setText] = useState('')
    const [commentErrors, setCommentErrors] = useState([])

    const handleCommentPost = async (e) => {
        e.preventDefault();

        setCommentErrors([]);

        const comment = {
            "text": text
        }

        try {
            const data = await dispatch(addCommentExpenseThunk(expense_id, comment))
            if (data.error) {
                await setCommentErrors(data.error);
            } else {
                setText('')
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form className='add_comment_form' onSubmit={handleCommentPost}>
            <div className='errors'>
                {commentErrors && (
                    <div className='errors'>{commentErrors}</div>
                )}
            </div>
            <div className='add_comment_input flex_col'>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    minLength={1}
                    maxLength={50}
                    placeholder='Add a comment'
                />
            </div>
            <button type='submit' className='post_comment_btn'>POST</button>
        </form>
    );
}

export default AddExpenseCommentForm;
