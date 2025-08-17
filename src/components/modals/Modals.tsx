interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }
  
  export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose} // close when clicking overlay
      >
        <div
          className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        >
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{title}</h2>
            <button onClick={onClose} className="text-red-500">X</button>
          </header>
          {children}
        </div>
      </div>
    );
  }
  