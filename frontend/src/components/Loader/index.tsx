import "./index.scss";

interface Props {
  color?: string;
}

const Loader = ({ color }: Props) => {
  return <div className="loader" style={{ borderTopColor: color }}></div>;
};

export default Loader;
