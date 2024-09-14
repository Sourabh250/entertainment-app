import React from "react";
import MediaCard from "./MediaCard";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const Media = ({ data }) => {
  const location = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // delaying each children"s animation by 0.15 seconds
        when: "beforeChildren", // staggering animation before children"s animation
        delayChildren: 0.1, // delay before starting children"s animations
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    transition: {
      type: "spring", 
      stiffness: 50,  
      damping: 10,   
      duration: 0.5,
    },
  };

  const isAnimatedRoute = location.pathname === "/bookmarks";

  return isAnimatedRoute ? (
    // Rendering animated list only if the current path is /bookmarks
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ willChange: 'opacity, transform' }} // Hinting browser for optimization
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {data.map((item) => (
        <motion.li key={item.id} variants={itemVariants}>
          <MediaCard key={item.id} item={item} isTrending={false} />
        </motion.li>
      ))}
    </motion.ul>
  ) : (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {
          data.map((item) => <MediaCard key={item.id} item={item} isTrending={false} />)
        }
      </div>
  );
};

export default Media;