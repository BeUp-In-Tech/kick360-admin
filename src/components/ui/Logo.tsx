import Image from "next/image";
import logoPic from "@/assets/kick_logo.png";

export function Logo({ className = "", size = "large" }: { className?: string, size?: "large" | "medium" | "small" }) {
  const width = size === "large" ? 220 : size === "medium" ? 150 : 100;
  
  return (
    <div className={`logo-container ${className}`} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    }}>
      <Image 
        src={logoPic} 
        alt="Kick360 Logo" 
        width={width}
        style={{ height: 'auto', objectFit: 'contain' }}
        priority 
      />
    </div>
  );
}
