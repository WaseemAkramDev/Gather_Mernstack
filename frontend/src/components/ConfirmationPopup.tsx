import React from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  variant?: "default" | "danger" | "success" | "warning" | "info";
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  variant = "default",
}) => {
  if (!isOpen) return null;

  const variants = {
    default: {
      icon: AlertCircle,
      iconColor: "text-blue-500",
      confirmBg: "bg-blue-500 hover:bg-blue-600",
      cancelBg: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    },
    danger: {
      icon: AlertTriangle,
      iconColor: "text-red-500",
      confirmBg: "bg-red-500 hover:bg-red-600",
      cancelBg: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-500",
      confirmBg: "bg-green-500 hover:bg-green-600",
      cancelBg: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    },
    warning: {
      icon: AlertCircle,
      iconColor: "text-yellow-500",
      confirmBg: "bg-yellow-500 hover:bg-yellow-600",
      cancelBg: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-500",
      confirmBg: "bg-blue-500 hover:bg-blue-600",
      cancelBg: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    },
  };

  const config = variants[variant] || variants.default;
  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white max-w-md w-full rounded-lg shadow-xl p-6 m-4 animate-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`${config.iconColor} mb-4`}>
            <Icon size={48} />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>

          <p className="text-sm text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3 w-full justify-center">
            <button
              onClick={onCancel}
              className={`px-4 py-2 ${config.cancelBg} rounded font-medium transition`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${config.confirmBg} text-white rounded font-medium transition`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
