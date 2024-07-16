import { FC } from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";

const Alert: FC = () => {
  const history = useNavigate();

  return (
    <div className="main">
      <div className="block">
        <div className="group">
          <h2>Greate</h2>
          <p>Your product add</p>
        </div>

        <button
          onClick={() => {
            history("/product-list");
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Alert;
