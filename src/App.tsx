import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Lock, Unlock, Binary, Shield, KeyRound, MessageSquare, ArrowRightLeft, Cpu, Power } from 'lucide-react';

type Method = 'PK' | 'DC';
type Mode = 'encrypt' | 'decrypt';

function App() {
  const [selectedMethods, setSelectedMethods] = useState<Set<Method>>(new Set());
  const [pkKey, setPkKey] = useState('');
  const [dcKey, setDcKey] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('');
  const [displayedOutput, setDisplayedOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encrypt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Characters used for the encryption animation effect
  const characters = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  const isMethodSelected = (method: Method) => selectedMethods.has(method);
  const bothMethodsSelected = selectedMethods.size === 2;

  // Terminal messages based on current state
  const terminalMessages = [
    { text: 'Initializing Shadow Veil v2.0...', color: 'text-green-400' },
    { text: `Current Mode: ${mode.toUpperCase()}`, color: 'text-green-400' },
    { text: `Active Protocols: ${Array.from(selectedMethods).join(', ') || 'none'}`, color: 'text-green-400' },
    ...(bothMethodsSelected && pkKey && dcKey ? [{ text: `All systems operational. Ready for ${mode}ion.`, color: 'text-green-400' }] : []),
    ...(isProcessing ? [
      { text: `Initiating ${mode} sequence...`, color: 'text-yellow-400' },
      { text: `Validating security protocols...`, color: 'text-yellow-400' },
      { text: `Generating cryptographic matrix...`, color: 'text-yellow-400' },
      { text: `Applying ${selectedMethods.has('PK') ? 'PK' : ''} ${selectedMethods.has('DC') ? 'DC' : ''} algorithms...`, color: 'text-yellow-400' },
      { text: `Finalizing data transformation...`, color: 'text-blue-400' }
    ] : []),
    ...(displayedOutput && !isAnimating ? [{ text: `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} complete.`, color: 'text-green-400' }] : [])
  ];

  // Animation effect for the output message
  useEffect(() => {
    if (isAnimating && outputMessage) {
      let currentIndex = 0;
      const finalMessage = outputMessage;
      const animationInterval = setInterval(() => {
        if (currentIndex <= finalMessage.length) {
          // Display the correct part of the message up to currentIndex
          const displayText = finalMessage.slice(0, currentIndex);
          // Generate random characters for the remaining part
          const remainingLength = finalMessage.length - currentIndex;
          const scrambledText = Array(remainingLength).fill(0)
            .map(() => characters[Math.floor(Math.random() * characters.length)])
            .join('');
          
          setDisplayedOutput(displayText + scrambledText);
          currentIndex++;
        } else {
          // Animation complete
          clearInterval(animationInterval);
          setIsAnimating(false);
          setDisplayedOutput(finalMessage);
        }
      }, 50); // Speed of the animation

      return () => clearInterval(animationInterval);
    }
  }, [isAnimating, outputMessage]);

  // Matrix rain effect for terminal
  useEffect(() => {
    if (!terminalRef.current) return;
    
    const canvas = document.createElement('canvas');
    const terminalElement = terminalRef.current;
    terminalElement.appendChild(canvas);
    
    canvas.width = terminalElement.clientWidth;
    canvas.height = terminalElement.clientHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.15';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height);
    }
    
    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0';
      ctx.font = '15px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        ctx.fillText(text, i * 20, drops[i] * 1);
        
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };
    
    const matrixInterval = setInterval(drawMatrix, 50);
    
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = terminalElement.clientWidth;
      canvas.height = terminalElement.clientHeight;
    });
    
    resizeObserver.observe(terminalElement);
    
    return () => {
      clearInterval(matrixInterval);
      resizeObserver.disconnect();
      if (terminalElement.contains(canvas)) {
        terminalElement.removeChild(canvas);
      }
    };
  }, []);

  // Processing stages animation
  useEffect(() => {
    if (isProcessing) {
      let stage = 0;
      let progress = 0;
      
      const stageInterval = setInterval(() => {
        if (stage < 4) {
          stage++;
          setProcessingStage(stage);
          progress = 0;
          setProcessingProgress(progress);
        } else {
          clearInterval(stageInterval);
        }
      }, 800);
      
      const progressInterval = setInterval(() => {
        if (progress < 100) {
          progress += 2;
          setProcessingProgress(progress);
        } else if (stage >= 4) {
          clearInterval(progressInterval);
        }
      }, 20);
      
      return () => {
        clearInterval(stageInterval);
        clearInterval(progressInterval);
      };
    } else {
      setProcessingStage(0);
      setProcessingProgress(0);
    }
  }, [isProcessing]);

  const toggleMethod = (method: Method) => {
    const newMethods = new Set(selectedMethods);
    if (newMethods.has(method)) {
      newMethods.delete(method);
      if (method === 'PK') setPkKey('');
      if (method === 'DC') setDcKey('');
    } else {
      newMethods.add(method);
    }
    setSelectedMethods(newMethods);
    setInputMessage('');
    setOutputMessage('');
    setDisplayedOutput('');
  };

  const handleModeSwitch = () => {
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
    setInputMessage('');
    setOutputMessage('');
    setDisplayedOutput('');
    setIsAnimating(false);
  };

  const processMessage = async () => {
    // Validate all required inputs are present
    if (!bothMethodsSelected || !pkKey || !dcKey || !inputMessage) return;

    // Start processing animation
    setIsProcessing(true);
    setDisplayedOutput('');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Encryption/decryption algorithm
    const shadowVeil = (text: string, pk: string, dc: string, encrypt: boolean) => {
      const combined = pk + dc;
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        const keyChar = combined.charCodeAt(i % combined.length);
        if (encrypt) {
          result += String.fromCharCode(char + keyChar);
        } else {
          result += String.fromCharCode(char - keyChar);
        }
      }
      return result;
    };

    // Process the message
    const result = shadowVeil(inputMessage, pkKey, dcKey, mode === 'encrypt');
    setOutputMessage(result);
    setIsProcessing(false);
    setIsAnimating(true); // Start the output animation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-green-500 p-6 font-mono relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#2563eb20,transparent)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-black/40 p-4 rounded-lg border border-green-500/20 backdrop-blur">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Shield className="w-10 h-10 text-green-400 animate-pulse" />
              <div className="absolute inset-0 animate-ping opacity-20">
                <Shield className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold glitch-text bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                NoPixel Message Security
              </h1>
              <p className="text-xs text-green-500/60">Advanced Encryption System</p>
            </div>
          </div>
          <button
            onClick={handleModeSwitch}
            className="cyber-button group relative overflow-hidden bg-black/40 px-6 py-3 rounded-lg border border-green-500/30 hover:border-green-400/60 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5" />
              <span>{mode === 'encrypt' ? 'Switch to Decrypt' : 'Switch to Encrypt'}</span>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-green-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="cyber-panel bg-black/40 p-6 rounded-lg border border-green-500/20 backdrop-blur relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h2 className="text-xl mb-6 flex items-center gap-3 pb-4 border-b border-green-500/20">
              <Cpu className="w-6 h-6" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Security Protocol Selection
              </span>
            </h2>

            {/* Protocol Selection Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* PK Protocol Button */}
              <button
                onClick={() => toggleMethod('PK')}
                className={`
                  relative p-4 rounded-lg border transition-all duration-300
                  ${isMethodSelected('PK')
                    ? 'bg-green-500/10 border-green-400 text-green-400' 
                    : 'bg-black/20 border-green-500/30 hover:border-green-400/60 text-green-500/80'}
                `}
              >
                <div className="flex items-center justify-center gap-3">
                  <Binary className={`w-5 h-5 transition-all duration-300 ${isMethodSelected('PK') ? 'rotate-180' : ''}`} />
                  <span className="font-semibold">PK</span>
                </div>
                {isMethodSelected('PK') && (
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                )}
              </button>

              {/* DC Protocol Button */}
              <button
                onClick={() => toggleMethod('DC')}
                className={`
                  relative p-4 rounded-lg border transition-all duration-300
                  ${isMethodSelected('DC')
                    ? 'bg-green-500/10 border-green-400 text-green-400' 
                    : 'bg-black/20 border-green-500/30 hover:border-green-400/60 text-green-500/80'}
                `}
              >
                <div className="flex items-center justify-center gap-3">
                  <Binary className={`w-5 h-5 transition-all duration-300 ${isMethodSelected('DC') ? 'rotate-180' : ''}`} />
                  <span className="font-semibold">DC</span>
                </div>
                {isMethodSelected('DC') && (
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                )}
              </button>
            </div>

            {/* Key Input Fields */}
            <div className="space-y-6">
              {/* PK Key Input */}
              <div>
                <label className="block mb-2 text-sm flex items-center gap-2 text-green-400">
                  <KeyRound className="w-4 h-4" /> PK Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={pkKey}
                    onChange={(e) => setPkKey(e.target.value)}
                    placeholder="Enter PK key"
                    disabled={!isMethodSelected('PK')}
                    className={`
                      w-full bg-black/60 border rounded-lg p-3 transition-all duration-300 placeholder-green-500/30
                      ${isMethodSelected('PK')
                        ? 'border-green-500/30 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400/50'
                        : 'border-green-500/10 opacity-50 cursor-not-allowed'}
                    `}
                  />
                  {isMethodSelected('PK') && (
                    <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-green-400/30 to-blue-500/30"></div>
                  )}
                </div>
              </div>

              {/* DC Key Input */}
              <div>
                <label className="block mb-2 text-sm flex items-center gap-2 text-green-400">
                  <KeyRound className="w-4 h-4" /> DC Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dcKey}
                    onChange={(e) => setDcKey(e.target.value)}
                    placeholder="Enter DC key"
                    disabled={!isMethodSelected('DC')}
                    className={`
                      w-full bg-black/60 border rounded-lg p-3 transition-all duration-300 placeholder-green-500/30
                      ${isMethodSelected('DC')
                        ? 'border-green-500/30 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400/50'
                        : 'border-green-500/10 opacity-50 cursor-not-allowed'}
                    `}
                  />
                  {isMethodSelected('DC') && (
                    <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-green-400/30 to-blue-500/30"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Protocol Status Indicators */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className={`text-center p-2 rounded border ${isMethodSelected('PK') ? 'border-green-400/50 text-green-400' : 'border-red-400/30 text-red-400/70'}`}>
                <span className="text-xs">PK Protocol: {isMethodSelected('PK') ? 'Active' : 'Inactive'}</span>
              </div>
              <div className={`text-center p-2 rounded border ${isMethodSelected('DC') ? 'border-green-400/50 text-green-400' : 'border-red-400/30 text-red-400/70'}`}>
                <span className="text-xs">DC Protocol: {isMethodSelected('DC') ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          {/* Message Panel - COMPLETELY REWRITTEN */}
          <div className="cyber-panel bg-black/40 p-6 rounded-lg border border-green-500/20 backdrop-blur relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h2 className="text-xl mb-6 flex items-center gap-3 pb-4 border-b border-green-500/20">
              <MessageSquare className="w-6 h-6" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Message {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
              </span>
            </h2>

            {/* Message Input Section */}
            <div className="space-y-6">
              {/* Input Message Field */}
              <div>
                <label className="block mb-2 text-sm text-green-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Input Message
                </label>
                <div className="relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Enter message to ${mode}...`}
                    disabled={!bothMethodsSelected || !pkKey || !dcKey}
                    className={`
                      w-full bg-black/60 border rounded-lg p-3 min-h-[120px] transition-all duration-300 placeholder-green-500/30
                      ${bothMethodsSelected && pkKey && dcKey
                        ? 'border-green-500/30 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400/50'
                        : 'border-green-500/10 opacity-50 cursor-not-allowed'}
                    `}
                  />
                  {bothMethodsSelected && pkKey && dcKey && (
                    <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-green-400/30 to-blue-500/30"></div>
                  )}
                </div>
                
                {/* Input Requirements Message */}
                {(!bothMethodsSelected || !pkKey || !dcKey) && (
                  <p className="mt-2 text-xs text-red-400/70">
                    {!bothMethodsSelected 
                      ? 'Both security protocols must be active' 
                      : !pkKey && !dcKey 
                        ? 'PK and DC keys required' 
                        : !pkKey 
                          ? 'PK key required' 
                          : 'DC key required'}
                  </p>
                )}
              </div>
              
              {/* Process Button */}
              <button 
                onClick={processMessage}
                disabled={!bothMethodsSelected || !pkKey || !dcKey || !inputMessage || isProcessing}
                className={`
                  cyber-button group relative w-full overflow-hidden rounded-lg border p-4 transition-all duration-300
                  ${bothMethodsSelected && pkKey && dcKey && inputMessage && !isProcessing
                    ? 'bg-green-500/10 border-green-400 text-green-400 hover:bg-green-500/20'
                    : 'bg-black/20 border-green-500/30 cursor-not-allowed opacity-50'}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-green-400 border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {mode === 'encrypt' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                    {`${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} Message`}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-green-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </button>

              {/* Output Message Section - Only visible when there's output */}
              {(displayedOutput || isAnimating) && (
                <div className="fade-in space-y-2 mt-6">
                  <label className="block text-sm text-green-400 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Output Message
                  </label>
                  <div className="relative">
                    <textarea
                      value={displayedOutput}
                      readOnly
                      className="w-full bg-black/60 border border-green-500/30 rounded-lg p-3 font-mono text-green-400 min-h-[120px]"
                    />
                    {/* Animation overlay */}
                    {isAnimating && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="h-0.5 bg-gradient-to-r from-green-400 to-blue-500 animate-scan"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Copy button */}
                  {!isAnimating && displayedOutput && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(displayedOutput);
                      }}
                      className="mt-2 text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy to clipboard
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terminal - COMPLETELY REWRITTEN */}
        <div className="mt-8 cyber-terminal bg-black/40 rounded-lg border border-green-500/20 backdrop-blur overflow-hidden relative">
          <div className="flex items-center gap-2 bg-black/60 px-4 py-2 border-b border-green-500/20">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs text-green-500/60">shadow_veil.terminal</span>
          </div>
          
          {/* Terminal Content */}
          <div ref={terminalRef} className="p-4 font-mono text-sm relative h-64 overflow-hidden">
            {/* Matrix Rain Effect is added via useEffect */}
            
            {/* Terminal Messages with Typewriter Effect */}
            <div className="relative z-10">
              {terminalMessages.map((message, index) => (
                <div key={index} className="terminal-line">
                  <p className={`typewriter-text ${message.color} ${index > 0 ? `delay-${index}` : ''}`}>
                    <span className="text-green-500">{'>'}</span> {message.text}
                    {index === terminalMessages.length - 1 && <span className="blinking-cursor">_</span>}
                  </p>
                </div>
              ))}
              
              {/* Processing Stages */}
              {isProcessing && processingStage > 0 && (
                <div className="mt-4 space-y-2">
                  {Array.from({ length: processingStage }).map((_, index) => (
                    <div key={`stage-${index}`} className="fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400">[{index + 1}/5]</span>
                        <span className="text-xs text-green-400">
                          {index === 0 && "Initializing security protocols..."}
                          {index === 1 && "Generating encryption matrix..."}
                          {index === 2 && "Applying cryptographic algorithms..."}
                          {index === 3 && "Processing data transformation..."}
                          {index === 4 && "Finalizing secure output..."}
                        </span>
                        {index < processingStage - 1 ? (
                          <span className="text-green-400 text-xs">✓</span>
                        ) : (
                          <span className="text-yellow-400 text-xs animate-pulse">⟳</span>
                        )}
                      </div>
                      
                      {/* Progress bar for current stage */}
                      {index === processingStage - 1 && (
                        <div className="w-full h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-100 ease-linear"
                            style={{ width: `${processingProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* System Status Indicators */}
            <div className="absolute bottom-4 left-4 right-4 border-t border-green-500/20 pt-2 flex justify-between text-xs text-green-500/60">
              <div>STATUS: {isProcessing ? "PROCESSING" : bothMethodsSelected && pkKey && dcKey ? "READY" : "STANDBY"}</div>
              <div className="flex gap-4">
                <span>PK: {isMethodSelected('PK') ? "ACTIVE" : "INACTIVE"}</span>
                <span>DC: {isMethodSelected('DC') ? "ACTIVE" : "INACTIVE"}</span>
                <span>MODE: {mode.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;