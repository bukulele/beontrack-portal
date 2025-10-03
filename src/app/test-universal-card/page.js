"use client";

import React, { useState } from "react";
import UniversalCard from "@/app/components/universal-card/UniversalCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateCardConfig, EXAMPLE_CONFIG } from "@/config/cards/schema";

/**
 * Test Harness for Universal Card
 *
 * This page allows testing the UniversalCard component with different configurations.
 * Useful for development and debugging.
 */
export default function TestUniversalCardPage() {
  // Default to example config
  const [configText, setConfigText] = useState(JSON.stringify(EXAMPLE_CONFIG, null, 2));
  const [config, setConfig] = useState(EXAMPLE_CONFIG);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState(null);

  const handleConfigChange = (e) => {
    setConfigText(e.target.value);
  };

  const handleApplyConfig = () => {
    try {
      // Parse JSON
      const parsedConfig = JSON.parse(configText);

      // Validate
      const validationResult = validateCardConfig(parsedConfig);
      setValidation(validationResult);

      if (validationResult.valid) {
        setConfig(parsedConfig);
        setError(null);
      } else {
        setError(`Configuration validation failed:\n${validationResult.errors.join("\n")}`);
      }
    } catch (err) {
      setError(`JSON Parse Error: ${err.message}`);
      setValidation(null);
    }
  };

  const handleReset = () => {
    setConfigText(JSON.stringify(EXAMPLE_CONFIG, null, 2));
    setConfig(EXAMPLE_CONFIG);
    setError(null);
    setValidation(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Universal Card Test Harness</h1>
          <p className="text-slate-600 mt-2">
            Test the UniversalCard component with custom configurations
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Config Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* JSON Editor */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Card Configuration (JSON)
                </label>
                <Textarea
                  value={configText}
                  onChange={handleConfigChange}
                  className="font-mono text-xs h-96"
                  placeholder="Enter card configuration..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleApplyConfig} className="flex-1">
                  Apply Configuration
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Reset to Example
                </Button>
              </div>

              {/* Validation Results */}
              {validation && (
                <Alert variant={validation.valid ? "default" : "destructive"}>
                  <AlertDescription>
                    {validation.valid ? (
                      <span className="text-green-600 font-semibold">
                        ✓ Configuration is valid
                      </span>
                    ) : (
                      <div>
                        <p className="font-semibold mb-2">Validation Errors:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {validation.errors.map((err, idx) => (
                            <li key={idx} className="text-sm">
                              {err}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Parse Errors */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <pre className="text-xs whitespace-pre-wrap">{error}</pre>
                  </AlertDescription>
                </Alert>
              )}

              {/* Config Info */}
              {config && !error && (
                <div className="p-4 bg-slate-100 rounded text-sm space-y-2">
                  <p>
                    <span className="font-semibold">Entity Type:</span> {config.entity?.type}
                  </p>
                  <p>
                    <span className="font-semibold">Provider:</span>{" "}
                    {config.entity?.contextProvider}
                  </p>
                  <p>
                    <span className="font-semibold">Tabs:</span> {config.tabs?.length}
                  </p>
                  <p>
                    <span className="font-semibold">Default Tab:</span> {config.defaultTab}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column - Card Preview */}
          <div>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  The card will render below with the current configuration
                </p>
              </CardContent>
            </Card>

            {/* Universal Card Render */}
            {config && !error && validation?.valid && (
              <div className="flex justify-center">
                <UniversalCard config={config} />
              </div>
            )}
          </div>
        </div>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Valid Entity Types:</h3>
                <ul className="list-disc list-inside text-slate-600">
                  <li>driver</li>
                  <li>truck</li>
                  <li>equipment</li>
                  <li>employee</li>
                  <li>incident</li>
                  <li>violation</li>
                  <li>wcb</li>
                  <li>driverReport</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Valid Tab Types:</h3>
                <ul className="list-disc list-inside text-slate-600">
                  <li>general-info</li>
                  <li>checklist</li>
                  <li>log</li>
                  <li>list</li>
                  <li>timecard</li>
                  <li>custom-claims</li>
                  <li>custom-violation-details</li>
                  <li>custom-seals</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
