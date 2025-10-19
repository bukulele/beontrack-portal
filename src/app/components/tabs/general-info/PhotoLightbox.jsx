"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * PhotoLightbox - Full-screen photo viewer using Radix Dialog
 *
 * Built with Radix Dialog to avoid conflicts when used inside another Dialog.
 * Provides full-screen photo viewing with navigation controls.
 *
 * @param {boolean} open - Whether lightbox is open
 * @param {Function} onClose - Callback when lightbox closes
 * @param {Array} photos - Array of photo objects with 'photo' property (URL)
 * @param {number} initialIndex - Initial photo index to display
 */
function PhotoLightbox({ open, onClose, photos, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Update index when initialIndex changes
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, photos]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 border-0 bg-black/95">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Photo Counter */}
        <div className="absolute top-4 left-4 z-50 text-white text-sm bg-black/50 px-3 py-1 rounded">
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Main Photo */}
        <div className="relative w-full h-full flex items-center justify-center p-16">
          <Image
            src={currentPhoto.photo}
            alt={`Photo ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Navigation Buttons */}
        {photos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-black/50 rounded">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-white scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={photo.photo}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PhotoLightbox;
