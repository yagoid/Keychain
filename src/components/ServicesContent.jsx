import { TEXTS } from "./../assets/locales/texts.js";
import BlockIcon from "./../assets/images/block_icon.svg";
import BlockchainImage from "./../assets/images/blockchain_image1.svg";
import "./ServicesContent.css";

const ServicesParagraph = ({ tittle, text, icon }) => {
  return (
    <div className="services-paragraph">
      <div className="icon-tittle">
        <img src={BlockIcon} className="icon-paragraph" alt="Locator square" />
        <p className="tittle-paragraph">{tittle}</p>
      </div>
      <p className="text-paragraph">{text}</p>
    </div>
  );
};

export default function ServicesContent() {
  return (
    <>
      <div className="services-tittle">
        <h1>
          <span></span>
          {TEXTS.servicesFirstTittle.en}
        </h1>
        <h2>{TEXTS.servicesSecondTittle.en}</h2>
      </div>
      <div className="services-content">
        <div className="column1">
          <img
            src={BlockchainImage}
            className="blockchain-image"
            alt="Locator square"
          />
        </div>
        <div className="column2">
          <ServicesParagraph
            tittle={TEXTS.servicesParagraphTittle1.en}
            text={TEXTS.servicesParagraph1.en}
          ></ServicesParagraph>

          <ServicesParagraph
            tittle={TEXTS.servicesParagraphTittle2.en}
            text={TEXTS.servicesParagraph2.en}
          ></ServicesParagraph>
          <ServicesParagraph
            tittle={TEXTS.servicesParagraphTittle3.en}
            text={TEXTS.servicesParagraph3.en}
          ></ServicesParagraph>

          <ServicesParagraph
            tittle={TEXTS.servicesParagraphTittle4.en}
            text={TEXTS.servicesParagraph4.en}
          ></ServicesParagraph>
        </div>
      </div>
    </>
  );
}
