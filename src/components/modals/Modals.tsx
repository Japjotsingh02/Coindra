import React from "react";
import DescriptionModal from "./DescriptionModal";
import { ModalTypes } from "../../types/store.types";
import { useAppStore } from "../../store/useAppStore";

function Modals() {
  const { modal, closeModal } = useAppStore();

  console.log(modal, 'check3');

  return (
    <>
      {modal.type === ModalTypes.Description && (
        <DescriptionModal
          open
          onChange={closeModal}
          {...modal?.props}
        />
      )}
    </>
  );
}

export default Modals;
