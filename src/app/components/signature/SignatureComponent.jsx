'use client';

import React, { useEffect, useRef, useState } from 'react';
import Signature from '@uiw/react-signature';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLoader } from '@/app/context/LoaderContext';

/**
 * SignatureComponent - Canvas-based signature capture with consent checkbox
 * Converts SVG signature to PNG base64 and saves to database
 *
 * @param {string} entityId - ID of the entity (employee, driver, etc.)
 * @param {string} entityType - Type of entity ('employees', 'drivers', etc.)
 * @param {function} onSignatureComplete - Callback when signature is saved successfully
 * @param {function} onCancel - Callback when user cancels
 */
export default function SignatureComponent({
  entityId,
  entityType,
  onSignatureComplete,
  onCancel,
}) {
  const [signaturePoints, setSignaturePoints] = useState([]);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [agreeToSave, setAgreeToSave] = useState(false);

  const { startLoading, stopLoading } = useLoader();

  const $svg = useRef(null);

  const clearSignatureCanvas = () => {
    $svg.current?.clear();
    setSignaturePoints([]);
  };

  const handlePointer = (data) => {
    if (data.length > 0) {
      setSignaturePoints([...signaturePoints, JSON.stringify(data)]);
    }
  };

  const saveSignature = async () => {
    startLoading();

    if (!$svg.current) {
      stopLoading();
      return;
    }

    try {
      const svgElement = $svg.current.svg;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = async () => {
        // Set canvas dimensions to match the SVG's viewBox or width/height
        const svgWidth =
          svgElement.width.baseVal.value || svgElement.viewBox.baseVal.width;
        const svgHeight =
          svgElement.height.baseVal.value || svgElement.viewBox.baseVal.height;

        canvas.width = svgWidth;
        canvas.height = svgHeight;

        // Draw white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, svgWidth, svgHeight);

        // Draw the signature on top
        ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
        URL.revokeObjectURL(url);

        // Convert to base64 PNG
        const pngBase64 = canvas.toDataURL('image/png');

        // Send to API
        const response = await fetch(`/api/portal/${entityType}/me/signature`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            signature: pngBase64,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          stopLoading();
          onSignatureComplete?.(data);
        } else {
          const error = await response.json();
          console.error('Failed to save signature:', error);
          stopLoading();
          alert('Failed to save signature. Please try again.');
        }
      };

      img.onerror = (error) => {
        console.error('Failed to load image', error);
        stopLoading();
        alert('Failed to process signature. Please try again.');
      };

      img.src = url;
    } catch (error) {
      console.error('Error saving signature:', error);
      stopLoading();
      alert('An error occurred while saving your signature.');
    }
  };

  // Enable submit button only if signature drawn AND consent checkbox checked
  useEffect(() => {
    if (signaturePoints.length > 0 && agreeToSave) {
      setReadyToSubmit(true);
    } else {
      setReadyToSubmit(false);
    }
  }, [signaturePoints, agreeToSave]);

  return (
    <div className="flex flex-col gap-4">
      {/* Signature Canvas */}
      <div className="border-2 border-gray-300 rounded-lg shadow-inner bg-white">
        <Signature
          style={{
            backgroundColor: 'transparent',
            width: '100%',
            height: '200px',
          }}
          options={{
            size: 6,
            smoothing: 0.46,
            thinning: 0.73,
            streamline: 0.5,
            start: {
              taper: 0,
              cap: true,
            },
            end: {
              taper: 0,
              cap: true,
            },
          }}
          onPointer={handlePointer}
          ref={$svg}
        />
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="agree-signature-save"
          checked={agreeToSave}
          onCheckedChange={setAgreeToSave}
        />
        <Label
          htmlFor="agree-signature-save"
          className="text-sm leading-tight cursor-pointer"
        >
          I agree to have my signature securely saved and used for signing future documents
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-between">
        <Button
          variant="outline"
          onClick={clearSignatureCanvas}
          type="button"
        >
          Clear
        </Button>
        <div className="flex gap-2">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={saveSignature}
            disabled={!readyToSubmit}
            type="button"
          >
            Agree And Submit
          </Button>
        </div>
      </div>

      {!readyToSubmit && (
        <p className="text-sm text-muted-foreground text-center">
          Please draw your signature and check the consent box to continue
        </p>
      )}
    </div>
  );
}
