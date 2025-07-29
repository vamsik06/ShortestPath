"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isShortestPath, setIsShortestPath] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleRouteClick = (routeId) => {
    setSelectedRoute(routeId);
    // Route 2 is the shortest path (you can change this logic)
    setIsShortestPath(routeId === 2);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Define the viewBox dimensions for the SVG
  const viewBoxWidth = 1000;
  const viewBoxHeight = 100; // Keep height consistent

  // Define the original coordinate ranges from your paths
  // These are used to scale the paths to the new viewBox
  // These values are derived from the min/max X/Y coordinates across all original paths
  const originalMinX = -20; // All paths should start at this X to align with viewBox 0
  const originalMaxX = 135;
  const originalMinY = 5;
  const originalMaxY = 60;

  // Helper function to scale original path coordinates to the new viewBox
  const scalePath = (pathString) => {
    // Calculate scaling factors and translation to map original range to [0, viewBoxWidth] and [0, viewBoxHeight]
    const scaleXFactor = viewBoxWidth / (originalMaxX - originalMinX);
    const scaleYFactor = viewBoxHeight / (originalMaxY - originalMinY);

    const transformCoord = (coord, type) => {
      if (type === "x") {
        // Map original X range [-20, 135] to [0, 1000]
        return ((coord - originalMinX) * scaleXFactor).toFixed(2);
      } else {
        // type === 'y'
        // Map original Y range [5, 60] to [0, 100]
        return ((coord - originalMinY) * scaleYFactor).toFixed(2);
      }
    };

    const commands = pathString.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);

    if (!commands) return "";

    let newPath = "";
    commands.forEach((cmd) => {
      const commandType = cmd[0];
      const argsString = cmd.substring(1).trim();
      const numbers = argsString
        .split(/[\s,]+/)
        .filter(Boolean)
        .map(Number);

      const transformedNumbers = [];
      // Process coordinates in pairs (x, y)
      for (let i = 0; i < numbers.length; i += 2) {
        const x = numbers[i];
        const y = numbers[i + 1];
        transformedNumbers.push(transformCoord(x, "x"));
        transformedNumbers.push(transformCoord(y, "y"));
      }
      newPath += `${commandType} ${transformedNumbers.join(" ")} `;
    });
    return newPath.trim();
  };

  // Original paths (these will be scaled by the scalePath function)
  const originalRoutes = [
    { id: 1, path: "M -20 60 Q40 5 60 30 Q80 55 135 52", color: "#000000", label: "Route 1" },
    // Corrected Route 2 to start at -20 X-coordinate
    { id: 2, path: "M -20 30 Q30 25 60 30 Q90 35 135 30", color: "#000000", label: "Route 2" },
    { id: 3, path: "M -20 10 Q20 45 40 15 Q60 50 80 10 Q100 40 135 10", color: "#000000", label: "Route 3" },
  ];

  // Scale the paths for the new viewBox
  const routes = originalRoutes.map((route) => ({
    ...route,
    path: scalePath(route.path),
  }));

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-background'} flex items-center justify-center  transition-colors duration-200`}>
      <div className={`w-full max-w-6xl border ${isDarkMode ? 'border-white/20 bg-white/5' : 'border-border bg-card/50'} rounded-lg p-6 sm:p-8 relative transition-colors duration-200`}>
        {/* Dark/Light Mode Toggle */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleDarkMode}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 ${isDarkMode ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-card border shadow-sm hover:bg-accent hover:text-accent-foreground'}`}
          >
            {isDarkMode ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          
          {/* Reset Icon */}
          <button
            onClick={() => {
              setSelectedRoute(null)
              setIsShortestPath(false)
            }}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 ${isDarkMode ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-card border shadow-sm hover:bg-accent hover:text-accent-foreground'}`}
            title="Reset"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Labels at the very top */}
        <div className="text-center mb-8 h-12 flex items-center justify-center">
          {selectedRoute && (
            <div
              className={`text-sm font-medium px-3 py-2 rounded-md shadow-sm inline-flex items-center gap-2 ${
                isShortestPath 
                  ? `${isDarkMode ? 'bg-green-900/50 text-green-300 border-green-600' : 'bg-green-50 text-green-700 border-green-200'} border` 
                  : `${isDarkMode ? 'bg-red-900/50 text-red-300 border-red-600' : 'bg-red-50 text-red-700 border-red-200'} border`
              }`}
            >
              {isShortestPath ? (
                <>
                  <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
                  Shortest Path!
                </>
              ) : (
                <>
                  <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-red-400' : 'bg-red-500'}`}></div>
                  Not Shortest Path
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Two Boxes with Multiple Routes */}
        <div className="flex items-center justify-between">
          {/* Home Box - Left Corner */}
          <div className={`${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-card border'} rounded-lg shadow-sm p-4 w-[160px] flex-shrink-0 transition-colors duration-200`}>
            <div className="flex flex-col items-center space-y-3">
              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-primary/5'} rounded-lg p-3`}>
          <Image
                  src="/home.svg"
                  alt="Home - Starting Point"
                  width={40}
                  height={40}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-foreground'}`}>Home</h3>
            </div>
          </div>

          {/* Individual Route Paths - Center */}
          <div className="flex flex-col gap-3 flex-1 relative">
            {routes.map((route, index) => (
              <div key={route.id} className="relative">
                {/* Distance Label */}
                <div className="text-center ">
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-white/80' : 'text-gray-600'}`}>
                    {index === 0 ? '8km' : index === 1 ? '2km' : '5km'}
                  </span>
                </div>
                
                <svg
                  viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                  fill="none"
                  className="w-full h-auto cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleRouteClick(route.id)}
                  preserveAspectRatio="none"
                >
                  <path
                    d={route.path}
                    stroke={selectedRoute === route.id 
                      ? (isShortestPath ? "#10b981" : "#ef4444") 
                      : (isDarkMode ? "#ffffff" : "#374151")
                    }
                    strokeWidth={selectedRoute === route.id ? "12" : "10"}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
          </div>

          {/* Office Box - Right Corner */}
          <div className={`${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-card border'} rounded-lg shadow-sm p-4 w-[160px] flex-shrink-0 transition-colors duration-200`}>
            <div className="flex flex-col items-center space-y-2">
              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-secondary/5'} rounded-lg p-3`}>
          <Image
                  src="/office.svg"
                  alt="Office - Destination"
                  width={40}
                  height={40}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <h3 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-foreground'}`}>Office</h3>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-muted-foreground'}`}>Click on a route to find the shortest path to KodNest Office</p>
        </div>
      </div>
    </div>
  );
}
