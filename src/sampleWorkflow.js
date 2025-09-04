/**
 * Sample workflow data for testing the React Flow canvas integration
 * This demonstrates how workflow data should be structured according to the schema
 */

import { NODE_TYPES, TRIGGER_TYPES, ACTION_TYPES, WAIT_TYPES } from './types/workflow';

export const sampleWorkflow = {
  id: "sample-workflow-001",
  name: "Welcome Email Sequence",
  description: "A sample workflow that sends welcome emails to new contacts",
  nodes: [
    {
      id: "node-001",
      type: NODE_TYPES.TRIGGER,
      position: { x: 100, y: 100 },
      data: {
        label: "When Contact is Created",
        description: "Starts when a new contact is created",
        triggerType: TRIGGER_TYPES.CONTACT_CREATED
      }
    },
    {
      id: "node-002",
      type: NODE_TYPES.ACTION,
      position: { x: 300, y: 100 },
      data: {
        label: "Send Welcome Email",
        description: "Send a welcome email to the new contact",
        actionType: ACTION_TYPES.SEND_EMAIL,
        emailConfig: {
          to: "{{contact.email}}",
          subject: "Welcome to Our Service!",
          body: "Hi {{contact.firstName}},\n\nWelcome to our service. We're excited to have you on board!"
        }
      }
    },
    {
      id: "node-003",
      type: NODE_TYPES.WAIT,
      position: { x: 500, y: 100 },
      data: {
        label: "Wait 24 Hours",
        description: "Wait for 24 hours before next action",
        waitType: WAIT_TYPES.DELAY,
        delayAmount: 24,
        delayUnit: "hours"
      }
    },
    {
      id: "node-004",
      type: NODE_TYPES.ACTION,
      position: { x: 700, y: 100 },
      data: {
        label: "Send Follow-up Email",
        description: "Send a follow-up email after 24 hours",
        actionType: ACTION_TYPES.SEND_EMAIL,
        emailConfig: {
          to: "{{contact.email}}",
          subject: "Checking In",
          body: "Hi {{contact.firstName}},\n\nJust checking in to see how you're doing with our service."
        }
      }
    }
  ],
  edges: [
    {
      id: "edge-001",
      source: "node-001",
      target: "node-002"
    },
    {
      id: "edge-002",
      source: "node-002",
      target: "node-003"
    },
    {
      id: "edge-003",
      source: "node-003",
      target: "node-004"
    }
  ],
  viewport: {
    x: 0,
    y: 0,
    zoom: 1
  },
  metadata: {
    version: "1.0.0",
    author: "System",
    tags: ["welcome", "onboarding", "email"],
    category: "onboarding"
  },
  settings: {
    isActive: true,
    runOn: "creation",
    errorHandling: {
      continueOnError: false,
      maxRetries: 3,
      retryDelay: 60
    }
  }
};

// A more complex workflow with conditions and forms
export const complexWorkflow = {
  id: "complex-workflow-002",
  name: "Lead Qualification Process",
  description: "A complex workflow that qualifies leads based on form submissions",
  nodes: [
    {
      id: "node-001",
      type: NODE_TYPES.TRIGGER,
      position: { x: 100, y: 100 },
      data: {
        label: "When Form is Submitted",
        description: "Starts when a lead qualification form is submitted",
        triggerType: TRIGGER_TYPES.FORM_SUBMISSION,
        formId: "lead-qualification-form"
      }
    },
    {
      id: "node-002",
      type: NODE_TYPES.CONDITION,
      position: { x: 300, y: 50 },
      data: {
        label: "Is High Value Lead?",
        description: "Check if the lead is high value",
        conditionType: "if_field_equals",
        field: "lead_score",
        operator: "greater_than",
        value: 80
      }
    },
    {
      id: "node-003",
      type: NODE_TYPES.ACTION,
      position: { x: 500, y: 0 },
      data: {
        label: "Add VIP Tag",
        description: "Add VIP tag to high value leads",
        actionType: ACTION_TYPES.ADD_TAG,
        tagConfig: {
          tagId: "vip-lead",
          tagName: "VIP Lead"
        }
      }
    },
    {
      id: "node-004",
      type: NODE_TYPES.ACTION,
      position: { x: 500, y: 100 },
      data: {
        label: "Add Standard Tag",
        description: "Add standard tag to regular leads",
        actionType: ACTION_TYPES.ADD_TAG,
        tagConfig: {
          tagId: "standard-lead",
          tagName: "Standard Lead"
        }
      }
    },
    {
      id: "node-005",
      type: NODE_TYPES.WAIT,
      position: { x: 700, y: 50 },
      data: {
        label: "Wait 1 Day",
        description: "Wait 1 day before follow-up",
        waitType: WAIT_TYPES.DELAY,
        delayAmount: 1,
        delayUnit: "days"
      }
    },
    {
      id: "node-006",
      type: NODE_TYPES.ACTION,
      position: { x: 900, y: 50 },
      data: {
        label: "Send VIP Follow-up",
        description: "Send follow-up email to VIP leads",
        actionType: ACTION_TYPES.SEND_EMAIL,
        emailConfig: {
          to: "{{contact.email}}",
          subject: "Exclusive Offer for VIP Leads",
          body: "Hi {{contact.firstName}},\n\nAs a VIP lead, we'd like to offer you an exclusive opportunity..."
        }
      }
    }
  ],
  edges: [
    {
      id: "edge-001",
      source: "node-001",
      target: "node-002"
    },
    {
      id: "edge-002",
      source: "node-002",
      target: "node-003",
      label: "Yes"
    },
    {
      id: "edge-003",
      source: "node-002",
      target: "node-004",
      label: "No"
    },
    {
      id: "edge-004",
      source: "node-003",
      target: "node-005"
    },
    {
      id: "edge-005",
      source: "node-005",
      target: "node-006"
    }
  ],
  viewport: {
    x: 0,
    y: 0,
    zoom: 1
  },
  metadata: {
    version: "1.0.0",
    author: "System",
    tags: ["lead", "qualification", "email"],
    category: "marketing"
  },
  settings: {
    isActive: true,
    runOn: "update",
    errorHandling: {
      continueOnError: true,
      maxRetries: 5,
      retryDelay: 120
    }
  }
};
