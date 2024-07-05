import React from 'react';

interface DeleteCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    title: string;
    triggerBtnLabel: "Delete" | "Yes" | "Confirm"
}

const CustomDialog: React.FC<DeleteCategoryDialogProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               onConfirm,
                                                               message,
                                                               title,
                                                               triggerBtnLabel
                                                           }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-60"></div>
            <div className="bg-background border-[1.5px] p-6 rounded-xl shadow-lg z-50 w-full max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">
                    {/*Are you absolutely sure?*/}
                    {title}
                </h2>
                <p className="mb-4 text-sm">
                    {/*This action cannot be undone. This will permanently delete your category and remove its data from our servers.*/}
                    {message}
                </p>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-border rounded">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-destructive text-white rounded">
                        {triggerBtnLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomDialog;
