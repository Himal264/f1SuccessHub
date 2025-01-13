import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  const handleFooterClick = (path) => {
    if (pathname === path) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
      });
    } else {
      navigate(path);
    }
  };

  return (
    <div onClick={(e) => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        handleFooterClick(link.getAttribute('href'));
      }
    }}>
      {children}
    </div>
  );
};

export default ScrollToTop;