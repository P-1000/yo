"use client";

import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Edit, Check, Info, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIcons } from '@/lib/icons/IconProvider';

export const IconNode = memo(({ data, selected }) => {
  const { label, icon, active = false, description = '' } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [nodeLabel, setNodeLabel] = useState(label);
  const [showDescription, setShowDescription] = useState(false);
  const [nodeDescription, setNodeDescription] = useState(description || 'Add a description...');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { getIcon, isDarkMode } = useIcons();

  const handleLabelChange = (e) => {
    setNodeLabel(e.target.value);
    data.label = e.target.value;
  };

  const handleDescriptionChange = (e) => {
    setNodeDescription(e.target.value);
    data.description = e.target.value;
  };

  // Parse icon data with improved error handling
  // Optimize the renderIcon function to be more memory efficient
  const renderIcon = () => {
    try {
      if (!icon) {
        return renderDefaultIcon();
      }
      
      if (typeof icon === 'string') {
        if (icon.startsWith('<svg')) {
          // For SVG strings, use a more efficient approach
          return (
            <div 
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: icon }} 
            />
          );
        } else {
          return (
            <div className="w-full h-full flex items-center justify-center text-sm font-medium">
              {icon.charAt(0)}
            </div>
          );
        }
      } else if (typeof icon === 'object' && icon !== null) {
        // Use a more efficient way to get icons
        return getIcon(icon.type, icon.name, { 
          collection: icon.collection,
          className: "w-5 h-5"
        });
      }
      
      return renderDefaultIcon();
    } catch (error) {
      return renderDefaultIcon();
    }
  };

  // Helper function for default icon
  // Memoize the default icon renderer
  const DefaultIcon = memo(() => (
    <div className="w-full h-full flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      </svg>
    </div>
  ));
  
  // Use the memoized component
  const renderDefaultIcon = () => <DefaultIcon />;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-primary border-[1.5px] border-background rounded-full"
      />
      
      <motion.div
        className={cn(
          "min-w-[180px] bg-gradient-to-br from-card/95 to-card/85 backdrop-blur-md p-3 rounded-xl border shadow-lg transition-all duration-300",
          selected ? "border-primary/70 ring-2 ring-primary/20" : "border-border/50",
          active ? "ring-2 ring-success/30 border-success/70" : "",
          isExpanded ? "min-w-[240px]" : ""
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
        layout
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div 
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-foreground overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            {renderIcon()}
          </motion.div>
          
          {isEditing ? (
            <input
              type="text"
              value={nodeLabel}
              onChange={handleLabelChange}
              className="flex-1 bg-background/70 border border-input/50 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            />
          ) : (
            <div className="flex-1 font-medium truncate">{nodeLabel}</div>
          )}
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-background/70"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-background/70"
              onClick={() => setShowDescription(!showDescription)}
            >
              <Info className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-background/70"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {showDescription && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              transition={{ duration: 0.2 }}
            >
              <div className="border-t border-border/30 pt-2 mt-1">
                {isEditingDescription ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={nodeDescription}
                      onChange={handleDescriptionChange}
                      className="w-full bg-background/50 border border-input/50 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-none"
                      autoFocus
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs px-2 rounded-md hover:bg-background/70"
                        onClick={() => setIsEditingDescription(false)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-muted-foreground">{nodeDescription}</div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs px-2 rounded-md hover:bg-background/70"
                        onClick={() => setIsEditingDescription(true)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 pt-2 border-t border-border/30 text-xs"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono bg-background/40 px-1.5 py-0.5 rounded text-[10px]">{data.id || "node_id"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px]">
                {data.nodeType || "Default"}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Source Handle - Fixed with proper string termination */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-2 h-2 bg-primary border-[1.5px] border-background rounded-full"
      />
    </>
  );
});
