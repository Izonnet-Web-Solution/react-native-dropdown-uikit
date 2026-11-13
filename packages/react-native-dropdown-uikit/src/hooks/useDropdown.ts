import { useState, useRef, useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { PopoverPlacement } from '../types/props';
import { useKeyboard } from './useKeyboard';

export interface DropdownLayout {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: 'top' | 'bottom';
}

export interface UseDropdownOptions {
  placement?: PopoverPlacement;
  maxHeight?: number;
  onOpen?: () => void;
  onClose?: () => void;
  disabled?: boolean;
}

export interface UseDropdownReturn {
  isOpen: boolean;
  layout: DropdownLayout;
  triggerRef: React.RefObject<any>;
  openDropdown: () => void;
  closeDropdown: () => void;
  toggleDropdown: () => void;
  measureAndOpen: () => void;
}

export const useDropdown = (options: UseDropdownOptions = {}): UseDropdownReturn => {
  const {
    placement = 'auto',
    maxHeight: requestedMaxHeight = 280,
    onOpen,
    onClose,
    disabled = false,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<any>(null);
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();

  const [layout, setLayout] = useState<DropdownLayout>({
    top: undefined,
    bottom: undefined,
    left: 0,
    width: 0,
    maxHeight: requestedMaxHeight,
    placement: 'bottom',
  });

  const calculateLayout = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
      const margin = 8;
      const targetWidth = Math.min(width, screenWidth - margin * 2);
      const safeLeft = Math.max(margin, Math.min(x, screenWidth - targetWidth - margin));

      const currentKeyboard = isKeyboardVisible && keyboardHeight > 0 ? keyboardHeight : 0;
      const effectiveScreenHeight = screenHeight - currentKeyboard;

      const spaceBelow = effectiveScreenHeight - (y + height) - margin * 2;
      const spaceAbove = y - margin * 2;

      let effectivePlacement: 'top' | 'bottom' = 'bottom';
      let availableMaxHeight = requestedMaxHeight;

      if (placement === 'bottom') {
        // If keyboard is open and space below is squeezed, avoid keyboard collision
        if (isKeyboardVisible && spaceBelow < 120 && spaceAbove > spaceBelow) {
          effectivePlacement = 'top';
          availableMaxHeight = Math.min(requestedMaxHeight, Math.max(80, spaceAbove));
        } else {
          effectivePlacement = 'bottom';
          availableMaxHeight = Math.min(requestedMaxHeight, Math.max(80, spaceBelow));
        }
      } else if (placement === 'top') {
        effectivePlacement = 'top';
        availableMaxHeight = Math.min(requestedMaxHeight, Math.max(80, spaceAbove));
      } else {
        // 'auto' collision detection with keyboard awareness
        if (
          (spaceBelow < requestedMaxHeight || (isKeyboardVisible && spaceBelow < 160)) &&
          spaceAbove > spaceBelow
        ) {
          effectivePlacement = 'top';
          availableMaxHeight = Math.min(requestedMaxHeight, Math.max(80, spaceAbove));
        } else {
          effectivePlacement = 'bottom';
          availableMaxHeight = Math.min(requestedMaxHeight, Math.max(80, spaceBelow));
        }
      }

      const calculatedTop = y + height + 4;
      const calculatedBottom = Math.max(margin, screenHeight - y + 4);

      setLayout({
        top: effectivePlacement === 'bottom' ? calculatedTop : undefined,
        bottom: effectivePlacement === 'top' ? calculatedBottom : undefined,
        left: safeLeft,
        width: targetWidth,
        maxHeight: availableMaxHeight,
        placement: effectivePlacement,
      });
    },
    [placement, requestedMaxHeight, keyboardHeight, isKeyboardVisible]
  );

  const measureAndOpen = useCallback(() => {
    if (disabled) return;

    if (triggerRef.current && typeof triggerRef.current.measureInWindow === 'function') {
      triggerRef.current.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          calculateLayout(x, y, width, height);
          setIsOpen(true);
          onOpen?.();
        }
      );
    } else {
      setIsOpen(true);
      onOpen?.();
    }
  }, [disabled, calculateLayout, onOpen]);

  // Re-measure when keyboard appears or disappears while dropdown is open
  useEffect(() => {
    if (isOpen && triggerRef.current && typeof triggerRef.current.measureInWindow === 'function') {
      triggerRef.current.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          calculateLayout(x, y, width, height);
        }
      );

      // Re-check after brief delay in case layout animated or scrolled
      const timer = setTimeout(() => {
        if (triggerRef.current && typeof triggerRef.current.measureInWindow === 'function') {
          triggerRef.current.measureInWindow(
            (x: number, y: number, width: number, height: number) => {
              calculateLayout(x, y, width, height);
            }
          );
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, keyboardHeight, isKeyboardVisible, calculateLayout]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const openDropdown = useCallback(() => {
    measureAndOpen();
  }, [measureAndOpen]);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
    } else {
      measureAndOpen();
    }
  }, [isOpen, closeDropdown, measureAndOpen]);

  return {
    isOpen,
    layout,
    triggerRef,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    measureAndOpen,
  };
};
