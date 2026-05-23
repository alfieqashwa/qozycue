"use client"

import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { TabsContent } from "@/components/ui/tabs"
import { Tv, Utensils } from "lucide-react"
import { motion } from "motion/react"
import { GiPoolTriangle } from "react-icons/gi"
import { AuthButtons } from "./auth-buttons"
import { DocumentationButton } from "./documentation-button"
import { Hero } from "./hero"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20, // Reduced from 30
    scale: 0.95, // Reduced from 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.6,
    },
  },
}

const floatingVariants = {
  animate: {
    y: [-5, 5, -5], // Reduced range
    rotate: [-1, 1, -1], // Reduced range
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1], // Reduced from 1.1
    opacity: [0.8, 1, 0.8], // Adjusted range
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

export const HomeContent = ({ slug }: { slug: string | null }) => (
  <TabsContent value="home" className="mt-12 overflow-hidden">
    <Hero />

    {/* Mobile Icons Section */}
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex w-full items-center justify-around overflow-hidden px-6 py-6 sm:hidden"
    >
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.1, rotate: 10 }} // Reduced values
        whileTap={{ scale: 0.95 }}
        className="will-change-transform"
      >
        <motion.div variants={floatingVariants} animate="animate">
          <GiPoolTriangle className="size-14 text-fuchsia-600" />
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.1, rotate: -10 }} // Reduced values
        whileTap={{ scale: 0.95 }}
        className="will-change-transform"
      >
        <motion.div variants={pulseVariants} animate="animate">
          <Utensils className="size-12 text-fuchsia-600" />
        </motion.div>
      </motion.div>
    </motion.section>

    {/* Main Buttons Section */}
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center justify-center gap-4 overflow-hidden sm:mt-8 sm:flex-row md:gap-8 lg:gap-16"
    >
      <motion.div
        variants={itemVariants}
        whileHover={{
          scale: 1.03, // Reduced from 1.05
          y: -3, // Reduced from -5
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }}
        whileTap={{ scale: 0.97 }}
        className="will-change-transform"
      >
        <DocumentationButton
          icon={
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1], // Reduced from 1.2
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <GiPoolTriangle size={24} className="text-fuchsia-500" />
            </motion.div>
          }
          title="Documentation"
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{
          scale: 1.03, // Reduced from 1.05
          y: -3, // Reduced from -5
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }}
        whileTap={{ scale: 0.97 }}
        className="will-change-transform"
      >
        <ShimmerButton className="h-11 overflow-hidden">
          <a
            href="https://docs-qozycue.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center text-center font-semibold"
          >
            <motion.div
              animate={{
                x: [-1, 1, -1], // Reduced from [-2, 2, -2]
                scale: [1, 1.05, 1], // Reduced from 1.1
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mr-2"
            >
              <Tv className="text-fuchsia-500" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: 5 }} // Reduced from 10
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-foreground font-semibold"
            >
              Tutorial
            </motion.span>
          </a>
        </ShimmerButton>
      </motion.div>
    </motion.section>

    {/* Auth Buttons Section */}
    <motion.section
      initial={{ opacity: 0, y: 30, scale: 0.9 }} // Reduced values
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 1.2,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileInView={{
        opacity: 1,
        transition: { duration: 0.6 },
      }}
      viewport={{ once: true, amount: 0.3 }}
      className="flex items-center justify-center gap-4 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileHover={{ scale: 1.01 }} // Reduced from 1.02
        whileTap={{ scale: 0.99 }}
        className="will-change-transform"
      >
        <AuthButtons slug={slug} />
      </motion.div>
    </motion.section>
  </TabsContent>
)
