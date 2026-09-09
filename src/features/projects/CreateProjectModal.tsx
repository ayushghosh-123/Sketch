"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Cpu, 
  Shield, 
  Zap, 
  Database,
  Layers,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (newProject: { id: string }) => void;
}

export function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Define
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Scale
  const [scale, setScale] = useState<"prototype" | "growth" | "high-scale">("growth");

  // Step 3: Priorities
  const [priorities, setPriorities] = useState<string[]>(["Performance", "Security"]);

  // Step 4: Technologies
  const [selectedTechs, setSelectedTechs] = useState<string[]>(["Next.js", "TypeScript", "PostgreSQL"]);
  const [customTech, setCustomTech] = useState("");

  const availablePriorities = [
    "Performance",
    "Security",
    "Scalability",
    "Cost Efficiency",
    "Development Speed",
    "High Availability",
  ];

  const availableTechs = [
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "Redis",
    "LangGraph.js",
    "Kafka",
    "Supabase",
    "Docker / K8s",
    "Go",
    "Python",
  ];

  const togglePriority = (p: string) => {
    setPriorities((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const toggleTech = (t: string) => {
    setSelectedTechs((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const addCustomTech = () => {
    if (customTech.trim() && !selectedTechs.includes(customTech.trim())) {
      setSelectedTechs([...selectedTechs, customTech.trim()]);
      setCustomTech("");
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        setError("System name is required.");
        return;
      }
      setError(null);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      name,
      description,
      project_type: scale === "prototype" ? "monolith" : scale === "growth" ? "microservices" : "distributed-mesh",
      target_users: `Targeted for ${scale} phase operations.`,
      functional_requirements: description,
      preferred_technologies: selectedTechs.join(", "),
      scalability_requirements: `Architecture prioritized for: ${priorities.join(", ")}. Scale Tier: ${scale}.`,
      security_requirements: priorities.includes("Security") ? "Mandatory mTLS, cryptographic tenant isolation, zero-trust validation." : "Standard TLS, RBAC controls.",
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success && result.data) {
        onClose();
        if (onProjectCreated) {
          onProjectCreated(result.data);
        }
        router.push(`/projects/${result.data.id}`);
      } else {
        setError(result.error || "Failed to initialize system architecture.");
      }
    } catch {
      setError("Network error while connecting to system orchestrator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 border border-[#27272a] bg-[#111113] text-[#f4f4f5] font-mono shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#0ea5e9] text-xs">◉</span>
            <span className="text-xs font-semibold text-[#f4f4f5] tracking-wider uppercase">
              NEW SYSTEM SPECIFICATION
            </span>
          </div>
          <div className="text-[11px] text-[#71717a]">
            STEP {currentStep} / 4
          </div>
        </div>

        {/* Progress Timeline: 01 ━━━●━━ 02 ━━━○━━ 03 ━━━○━━ 04 */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between text-[11px] text-[#71717a] border-b border-[#27272a]/60">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${currentStep >= 1 ? "bg-[#0ea5e9]" : "bg-[#27272a]"}`} />
            <span className={currentStep === 1 ? "text-[#f4f4f5] font-semibold" : ""}>01 DEFINE</span>
          </div>
          <span className="text-[#27272a]">━━━━</span>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${currentStep >= 2 ? "bg-[#0ea5e9]" : "bg-[#27272a]"}`} />
            <span className={currentStep === 2 ? "text-[#f4f4f5] font-semibold" : ""}>02 SCALE</span>
          </div>
          <span className="text-[#27272a]">━━━━</span>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${currentStep >= 3 ? "bg-[#0ea5e9]" : "bg-[#27272a]"}`} />
            <span className={currentStep === 3 ? "text-[#f4f4f5] font-semibold" : ""}>03 PRIORITIES</span>
          </div>
          <span className="text-[#27272a]">━━━━</span>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${currentStep >= 4 ? "bg-[#0ea5e9]" : "bg-[#27272a]"}`} />
            <span className={currentStep === 4 ? "text-[#f4f4f5] font-semibold" : ""}>04 TECH</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 min-h-[300px] flex flex-col justify-between">
          {error && (
            <div className="p-3 rounded bg-red-950/30 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: DEFINE */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="text-xs text-[#0ea5e9] uppercase font-semibold">01 / DEFINE</div>
                <h3 className="text-base font-semibold text-[#f4f4f5] mt-0.5">What are you building?</h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-[#a1a1aa]">System Identifier / Project Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Payment Gateway"
                  className="bg-[#09090b] border-[#27272a] text-xs font-mono text-[#f4f4f5] focus:border-[#0ea5e9]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-[#a1a1aa]">System Description & Core Capabilities</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your product requirements, user workflows, data inputs, and scale expectations..."
                  className="bg-[#09090b] border-[#27272a] text-xs font-mono text-[#f4f4f5] focus:border-[#0ea5e9] resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SCALE */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="text-xs text-[#0ea5e9] uppercase font-semibold">02 / SCALE</div>
                <h3 className="text-base font-semibold text-[#f4f4f5] mt-0.5">How should this system operate?</h3>
              </div>

              <div className="space-y-3 pt-2">
                <div
                  onClick={() => setScale("prototype")}
                  className={`p-3.5 rounded border cursor-pointer transition-all flex items-start gap-3 ${
                    scale === "prototype"
                      ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                      : "bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]"
                  }`}
                >
                  <div className="mt-0.5">{scale === "prototype" ? "●" : "○"}</div>
                  <div>
                    <div className="text-xs font-semibold text-[#f4f4f5]">Prototype / MVP</div>
                    <div className="text-[11px] text-[#71717a] mt-0.5">
                      Low complexity, minimal operational cost, fast iteration, single-instance database.
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setScale("growth")}
                  className={`p-3.5 rounded border cursor-pointer transition-all flex items-start gap-3 ${
                    scale === "growth"
                      ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                      : "bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]"
                  }`}
                >
                  <div className="mt-0.5">{scale === "growth" ? "●" : "○"}</div>
                  <div>
                    <div className="text-xs font-semibold text-[#f4f4f5]">Growing Product</div>
                    <div className="text-[11px] text-[#71717a] mt-0.5">
                      Modular microservices, caching layer (Redis), async job queues, auto-scaling API routers.
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setScale("high-scale")}
                  className={`p-3.5 rounded border cursor-pointer transition-all flex items-start gap-3 ${
                    scale === "high-scale"
                      ? "bg-[#18181b] border-[#0ea5e9] ring-1 ring-[#0ea5e9]"
                      : "bg-[#09090b] border-[#27272a] hover:border-[#3f3f46]"
                  }`}
                >
                  <div className="mt-0.5">{scale === "high-scale" ? "●" : "○"}</div>
                  <div>
                    <div className="text-xs font-semibold text-[#f4f4f5]">High-Scale Distributed System</div>
                    <div className="text-[11px] text-[#71717a] mt-0.5">
                      Multi-region active-active clusters, Kafka message bus, circuit breakers, 99.99% availability SLA.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PRIORITIES */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="text-xs text-[#0ea5e9] uppercase font-semibold">03 / PRIORITIES</div>
                <h3 className="text-base font-semibold text-[#f4f4f5] mt-0.5">Select architecture priorities</h3>
                <p className="text-xs text-[#71717a] mt-0.5">The multi-agent council weights tradeoffs based on these targets.</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {availablePriorities.map((p) => {
                  const isSelected = priorities.includes(p);
                  return (
                    <div
                      key={p}
                      onClick={() => togglePriority(p)}
                      className={`p-3 rounded border cursor-pointer text-xs font-mono transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#f4f4f5]"
                          : "bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]"
                      }`}
                    >
                      <span>[ {p} ]</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#0ea5e9]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: TECHNOLOGY */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="text-xs text-[#0ea5e9] uppercase font-semibold">04 / TECHNOLOGY</div>
                <h3 className="text-base font-semibold text-[#f4f4f5] mt-0.5">Preferred technologies & tools</h3>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {availableTechs.map((t) => {
                  const isSelected = selectedTechs.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTech(t)}
                      className={`px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#0ea5e9] text-[#09090b] font-semibold"
                          : "bg-[#09090b] border border-[#27272a] text-[#a1a1aa] hover:text-[#f4f4f5]"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Input
                  value={customTech}
                  onChange={(e) => setCustomTech(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTech())}
                  placeholder="Add custom technology (e.g. Cassandra, ClickHouse)..."
                  className="bg-[#09090b] border-[#27272a] text-xs text-[#f4f4f5]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomTech}
                  className="border-[#27272a] bg-[#18181b] text-xs h-9 px-3"
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          {/* Bottom Button Actions */}
          <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                disabled={loading}
                className="border-[#27272a] bg-[#09090b] text-xs h-9 px-3 text-[#a1a1aa] hover:text-[#f4f4f5]"
              >
                <ArrowLeft className="h-3 w-3 mr-1.5" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] text-xs h-9 px-4 font-semibold"
              >
                Continue
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-[#09090b] text-xs h-9 px-5 font-semibold"
              >
                {loading ? "Synthesizing Architecture..." : "Generate System Architecture →"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
