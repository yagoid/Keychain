import { TEXTS } from "../../../assets/locales/texts.js";
import xIcon from "./../../../assets/images/x_icon.png";
import "./CheckDataPopup.css";

export default function CheckDataPupup({ onClose, blockchainUserData }) {
  const handleCancel = (e) => {
    e.preventDefault();
    // Cerrar el popup
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="data-container">
        <div className="header-data-container">
          <h2 className="blockchain-data-tittle">
            {TEXTS.myBlockchainData.en}
          </h2>
          <img
            src={xIcon}
            onClick={handleCancel}
            className="close_icon"
            alt="close icon"
          />
        </div>
        <div className="body-data-container">
          {blockchainUserData.map((data, index) => (
            <pre key={index}>{data}</pre> // Utiliza <pre> para mantener el formato
          ))}
        </div>
      </div>
    </div>
  );
}
