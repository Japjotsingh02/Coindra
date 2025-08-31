import { motion } from "framer-motion";

export function ModernCalendarSkeleton() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const pulseVariants = {
    initial: { opacity: 0.3 },
    animate: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      className="rounded-lg shadow-md overflow-hidden border border-[#20232E] bg-[#0a0a0a] px-12 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Skeleton */}
      <motion.div
        className="flex items-center justify-between pt-2 pb-4"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            className="h-8 w-32 bg-gradient-to-r from-[#1e2126] to-[#2a2d36] rounded-lg"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className="h-10 w-20 bg-gradient-to-r from-[#bb9c2d] to-[#bc7129] rounded-lg"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-[#1e2126] rounded-lg bg-[#1e2126] overflow-hidden">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-10 w-16 bg-gradient-to-r from-[#2a2d36] to-[#1e2126]"
                variants={pulseVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
          <motion.div
            className="h-10 w-10 bg-gradient-to-r from-[#2a2d36] to-[#1e2126] rounded-lg"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className="h-10 w-10 bg-gradient-to-r from-[#2a2d36] to-[#1e2126] rounded-lg"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
        </div>
      </motion.div>

      {/* Days Header Skeleton */}
      <motion.div
        className="grid grid-cols-7 gap-3 px-2 py-2"
        variants={itemVariants}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
          <motion.div
            key={day}
            className="text-center"
            variants={itemVariants}
            transition={{ delay: i * 0.05 }}
          >
            <motion.div
              className="h-6 w-12 mx-auto bg-gradient-to-r from-[#1e2126] to-[#2a2d36] rounded"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Calendar Grid Skeleton */}
      <motion.div
        className="grid grid-cols-7 gap-3 pt-2"
        variants={itemVariants}
      >
        {Array.from({ length: 35 }).map((_, i) => (
          <motion.div
            key={i}
            className="relative"
            variants={itemVariants}
            transition={{ delay: i * 0.02 }}
          >
            <motion.div
              className="h-24 w-full rounded-md bg-gradient-to-br from-[#1e2126] via-[#2a2d36] to-[#1e2126] relative overflow-hidden"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              
              {/* Date placeholder */}
              <div className="absolute top-2 left-2">
                <motion.div
                  className="h-4 w-4 bg-gradient-to-r from-[#bb9c2d] to-[#bc7129] rounded"
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
              
              {/* Sparkline placeholder */}
              <div className="absolute bottom-2 left-1 right-1">
                <motion.div
                  className="h-3 bg-gradient-to-r from-[#2a2d36] to-[#1e2126] rounded"
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function ModernWelcomeSkeleton() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      className="flex-1 overflow-auto flex items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="text-center space-y-6"
        variants={itemVariants}
      >
        {/* Logo/Icon placeholder */}
        <motion.div
          className="mx-auto w-20 h-20 bg-gradient-to-br from-[#bb9c2d] to-[#bc7129] rounded-full flex items-center justify-center"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity },
            scale: { duration: 2, repeat: Infinity },
          }}
        >
          <motion.div
            className="w-8 h-8 bg-white rounded"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.div
          className="space-y-3"
          variants={itemVariants}
        >
          <motion.h2
            className="text-3xl font-bold bg-gradient-to-r from-[#bb9c2d] to-[#bc7129] bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            Welcome to Coindra
          </motion.h2>
          <motion.p
            className="text-[#7c8796] text-lg max-w-md mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Select a trading pair from the sidebar to explore market seasonality patterns
          </motion.p>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="flex justify-center space-x-2"
          variants={itemVariants}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-[#bb9c2d] to-[#bc7129] rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
