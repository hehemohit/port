"use client";

import { useEffect, useRef } from "react";
import bg6052105 from "../assets/6052105.jpg";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
}

export function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load background image
    const img = new Image();
    img.src = bg6052105.src;
    img.onload = () => {
      imageRef.current = img;
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize nodes
    const nodeCount = 50;
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 2,
      });
    }

    nodesRef.current = nodes;

    // Initialize connections
    const updateConnections = () => {
      const connections: Connection[] = [];
      const nodes = nodesRef.current;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            connections.push({
              from: i,
              to: j,
              opacity: 1 - distance / 150,
            });
          }
        }
      }

      connectionsRef.current = connections;
    };

    updateConnections();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      let connections = connectionsRef.current;
      const mouseX = mousePosRef.current.x;
      const mouseY = mousePosRef.current.y;
      const img = imageRef.current;

      // Draw background image
      if (img) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      // Draw white overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update connections dynamically
      updateConnections();
      connections = connectionsRef.current;

      // Set composite operation to reveal background through white overlay
      ctx.globalCompositeOperation = "destination-out";

      // Update and draw connections
      connections.forEach((conn) => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        if (!fromNode || !toNode) return;

        const dx = fromNode.x - toNode.x;
        const dy = fromNode.y - toNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Mouse influence on connections
        const mouseDx1 = fromNode.x - mouseX;
        const mouseDy1 = fromNode.y - mouseY;
        const mouseDx2 = toNode.x - mouseX;
        const mouseDy2 = toNode.y - mouseY;
        const mouseDist1 = Math.sqrt(mouseDx1 * mouseDx1 + mouseDy1 * mouseDy1);
        const mouseDist2 = Math.sqrt(mouseDx2 * mouseDx2 + mouseDy2 * mouseDy2);
        const mouseInfluence = Math.max(0, 1 - Math.min(mouseDist1, mouseDist2) / 200);

        if (distance < 150) {
          const opacity = (1 - distance / 150) * (0.3 + mouseInfluence * 0.4);

          // Use opacity to control how much white overlay is removed
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = `rgba(255, 218, 3, 1)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      // Update and draw nodes
      nodes.forEach((node) => {
        // Mouse influence on nodes
        const mouseDx = node.x - mouseX;
        const mouseDy = node.y - mouseY;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        const mouseInfluence = Math.max(0, 1 - mouseDist / 200);

        // Repel from mouse
        if (mouseDist < 200 && mouseDist > 0) {
          const force = (200 - mouseDist) / 200;
          node.vx += (mouseDx / mouseDist) * force * 0.1;
          node.vy += (mouseDy / mouseDist) * force * 0.1;
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -0.8;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
        }

        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -0.8;
          node.y = Math.max(0, Math.min(canvas.height, node.y));
        }

        // Damping
        node.vx *= 0.98;
        node.vy *= 0.98;

        // Draw node with mouse influence
        const nodeRadius = node.radius + mouseInfluence * 4;
        const nodeOpacity = 0.5 + mouseInfluence * 0.5;

        // Glow effect - reveal background
        if (mouseInfluence > 0.2) {
          const glowRadius = nodeRadius * 3;
          const glowOpacity = mouseInfluence * 0.6;
          
          ctx.globalAlpha = glowOpacity;
          ctx.fillStyle = "rgba(255, 218, 3, 1)";
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Draw node - reveal background
        ctx.globalAlpha = nodeOpacity;
        ctx.fillStyle = "rgba(255, 218, 3, 1)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Reset composite operation for next frame
      ctx.globalCompositeOperation = "source-over";

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "transparent", width: "100%", height: "100%" }}
    />
  );
}

