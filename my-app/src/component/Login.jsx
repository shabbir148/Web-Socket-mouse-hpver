import React from 'react'

export default function LoginForm({onSubmit}) {
    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        onSubmit(username);
    }
    return (
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
               
                <button type="submit">Login</button>
            </form>
        </div>
    )
}