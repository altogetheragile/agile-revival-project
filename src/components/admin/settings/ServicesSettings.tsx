
import React, { useState } from "react";
import { useSiteSettings } from "@/contexts/site-settings/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_SERVICES = [
  {
    icon: "Compass",
    title: "Leadership Coaching",
    description: "Personalized one-on-one coaching to help leaders cultivate an agile mindset and empower self-organizing teams.",
    url: "/services/leadership-coaching"
  },
  {
    icon: "Users",
    title: "Team Coaching",
    description: "Collaborative coaching for agile teams using Scrum, Kanban, or hybrid methods to enhance teamwork and delivery efficiency.",
    url: "/services/team-coaching"
  },
  {
    icon: "Laptop",
    title: "Agile Training",
    description: "Engaging workshops and certification courses on agile methodologies, customized to your organization's unique context.",
    url: "/training-schedule"
  },
  {
    icon: "Activity",
    title: "Agile Facilitation",
    description: "Strategic facilitation of key agile ceremonies, retrospectives, and planning sessions to drive meaningful collaboration.",
    url: "/services/agile-facilitation"
  },
  {
    icon: "BarChart3",
    title: "Performance Metrics",
    description: "Developing insightful measurement approaches that focus on outcomes, continuous improvement, and organizational growth.",
    url: "/services/performance-metrics"
  },
  {
    icon: "Puzzle",
    title: "Custom Coaching Solutions",
    description: "Tailored, flexible coaching programs designed to address your organization's specific challenges and strategic goals.",
    url: "/services/custom-coaching"
  }
];

const iconNames = [
  "Compass",
  "Users",
  "Laptop",
  "Activity",
  "BarChart3",
  "Puzzle"
]

export const ServicesSettings: React.FC = () => {
  const { settings, updateSettings, isLoading } = useSiteSettings();
  const storedServices = settings.services || DEFAULT_SERVICES;
  const [services, setServices] = useState(storedServices);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (idx: number, field: string, value: string) => {
    setServices(prev =>
      prev.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSettings("services", services);
    setSaving(false);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-agile-purple">Edit Services Section</h2>
      <p className="mb-6 text-gray-600">
        Update the text for each service below. Changes appear instantly on your public site.
      </p>
      {services.map((service, idx) => (
        <div key={idx} className="p-4 border rounded-lg mb-6 bg-white/80">
          <div className="mb-3 flex gap-4">
            <Input
              label="Title"
              value={service.title}
              onChange={e => handleInputChange(idx, "title", e.target.value)}
              placeholder="Service Title"
              className="font-semibold"
            />
            <Input
              disabled
              value={iconNames[idx]}
              className="w-40 text-gray-500 opacity-80"
              style={{ background: "#f6f6fa" }}
            />
          </div>
          <Textarea
            label="Description"
            value={service.description}
            onChange={e => handleInputChange(idx, "description", e.target.value)}
            placeholder="Service Description"
          />
          <Input
            value={service.url}
            onChange={e => handleInputChange(idx, "url", e.target.value)}
            placeholder="URL (e.g. /services/team-coaching)"
            className="mt-3"
            label="URL"
          />
        </div>
      ))}
      <Button onClick={handleSave} disabled={saving || isLoading}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

