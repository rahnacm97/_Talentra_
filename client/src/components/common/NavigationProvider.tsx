import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationStore } from "../../utils/navigate";

const NavigationProvider: React.FC = () => {
  const navigate = useNavigate();
  const setNavigate = useNavigationStore((state) => state.setNavigate);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);

  return null;
};

export default NavigationProvider;
