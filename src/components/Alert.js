import React from 'react';

const Alert = (props) => {
    return (
        <div style={{ height: '54px' }}>
            {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
                <i className="fa-solid fa-circle-info mx-2"></i>
                {props.alert.message}
            </div>}
        </div>
    )
}

export default Alert;