import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editCommentExpenseThunk } from '../../store/expenses';
import './EditExpenseComment.css'


function EditExpenseCommentForm({ expense_id, comment_id, original_text, toggleEditComment }) {
    const dispatch = useDispatch()

    const [text, setText] = useState('')
    const [commentErrors, setCommentErrors] = useState()

    useEffect(() => {
        //removes edited on tag if comment previously edited
        if (original_text) {
            const text_split = original_text.split('(comment edited on ')
            setText(text_split[0])
        }
    },[])



    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        setCommentErrors([]);

        //add date of edit to end of text
        const comment = {
            "text": text + ` (comment edited on ${new Date().toLocaleString('default', { month: 'short', day: "numeric" })})`
        }

        try {
            const data = await dispatch(editCommentExpenseThunk(expense_id, comment_id, comment))
            if (data.error) {
                await setCommentErrors(data.error);
            } else {
                // setText(text)
                toggleEditComment()
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form className='edit_comment_form flex_col display_none' onSubmit={handleSubmitEdit} id={`expense_comment${comment_id}`}>
            <div className='edit_comment_form_title'>Edit comment:</div>
            <div className='errors'>
                {commentErrors && (
                    <div className='errors'>{commentErrors}</div>
                    )}
            </div>
            <div className='edit_comment_input flex_col'>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    minLength={1}
                    maxLength={50}
                />
            </div>
            <div className='edit_comment_form_btn_container'>
                <button type="button" className='edit_comment_cancel' onClick={toggleEditComment}>Cancel</button>
                <button type='submit' className='edit_comment_done'>Done</button>
            </div>
        </form>
    );
}

export default EditExpenseCommentForm;
