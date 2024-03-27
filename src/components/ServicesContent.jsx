import { TEXTS } from "./../assets/locales/texts.js";
import "./ServicesContent.css";

const ServicesParagraph = ({ tittle, text }) => {
  return (
    <div className="services-paragraph">
      <p className="tittle-paragraph">{tittle}</p>
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
          {TEXTS.services.en}
        </h1>
        <h2>{TEXTS.servicesSecondTittle.en}</h2>
      </div>
      <div className="services-content">
        <div className="column1">
          <ServicesParagraph
            tittle={TEXTS.servicesParagraphTittle1.en}
            text={TEXTS.servicesParagraph1.en}
          ></ServicesParagraph>

          <ServicesParagraph
            tittle={TEXTS.servicesParagraphTittle2.en}
            text={TEXTS.servicesParagraph2.en}
          ></ServicesParagraph>
        </div>
        <div className="column2">
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
