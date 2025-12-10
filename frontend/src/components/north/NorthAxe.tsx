import "./north-axe.css";

export type NorthAxeProps = {
  side?: "left" | "right";
};

export function NorthAxe({ side = "left" }: NorthAxeProps) {
  return (
    <div className={`north-axe north-axe--${side}`} aria-hidden="true" role="presentation">
      <div className="north-axe__mirror">
        <div className="north-axe__swing">
          <div className="north-axe__body">
            <div className="north-axe__head north-axe__head--right">
              <div className="north-axe__blade" />
              <div className="north-axe__edge" />
              <div className="north-axe__notch" />
            </div>
            <div className="north-axe__head north-axe__head--left">
              <div className="north-axe__blade" />
              <div className="north-axe__edge" />
              <div className="north-axe__notch" />
            </div>
            <div className="north-axe__handle" />
            <div className="north-axe__leather" />
            <div className="north-axe__pommel" />
            <div className="north-axe__spark" />
          </div>
        </div>
      </div>
    </div>
  );
}
