import ConfirmationModal from '../../../components/ui/ConfirmationModal';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      title="Estás a punto de cerrar sesión"
      message="¿Estás seguro de cerrar tu sesión?"
      confirmButtonText="Cerrar sesión"
      confirmButtonColor="#FFC600" // Color amarillo corporativo
      cancelButtonText="Cancelar"
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmButtonTextColor="#01426A" // Color azul corporativo para el texto
    />
  );
}