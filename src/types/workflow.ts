/**
 * Workflow TypeScript Interfaces for GoHighLevel-like CRM
 * 
 * These interfaces define the structure for workflows in the frontend.
 * They match the schema defined in backend/src/utils/workflowSchema.js
 */

// Base node interface
export interface BaseNode {
  id: string;
  type: 'trigger' | 'action' | 'form' | 'wait' | 'condition' | 'webhook';
  position: {
    x: number;
    y: number;
  };
  data: Record<string, any>;
  config?: Record<string, any>;
}

// Trigger node interface
export interface TriggerNode extends BaseNode {
  type: 'trigger';
  data: {
    label: string;
    description: string;
    triggerType: 'tag_added' | 'form_submission' | 'webhook' | 'contact_created' | 'contact_updated';
    tagId?: string;
    formId?: string;
    webhookUrl?: string;
  };
}

// Action node interface
export interface ActionNode extends BaseNode {
  type: 'action';
  data: {
    label: string;
    description: string;
    actionType: 'send_email' | 'send_sms' | 'add_tag' | 'remove_tag' | 'create_task' | 'update_contact';
    emailConfig?: {
      to: string;
      subject: string;
      body: string;
      templateId?: string;
    };
    smsConfig?: {
      to: string;
      message: string;
    };
    tagConfig?: {
      tagId: string;
      tagName?: string;
    };
    taskConfig?: {
      title: string;
      description?: string;
      dueDate?: string;
      assigneeId?: string;
    };
    contactUpdateConfig?: {
      field: string;
      value: string | number | boolean;
    };
  };
}

// Form node interface
export interface FormNode extends BaseNode {
  type: 'form';
  data: {
    label: string;
    description: string;
    formTitle: string;
    formFields: FormField[];
    submitButtonText?: string;
  };
}

export interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Wait node interface
export interface WaitNode extends BaseNode {
  type: 'wait';
  data: {
    label: string;
    description: string;
    waitType: 'delay' | 'until' | 'date';
    delayAmount?: number;
    delayUnit?: 'minutes' | 'hours' | 'days' | 'weeks';
    waitUntil?: string;
    specificDate?: string;
  };
}

// Condition node interface
export interface ConditionNode extends BaseNode {
  type: 'condition';
  data: {
    label: string;
    description: string;
    conditionType: 'if_field_equals' | 'if_tag_exists' | 'if_date_passed' | 'if_custom';
    field?: string;
    operator?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value?: string | number | boolean;
    tagId?: string;
    dateField?: string;
    daysOffset?: number;
    customLogic?: string;
  };
}

// Webhook node interface
export interface WebhookNode extends BaseNode {
  type: 'webhook';
  data: {
    label: string;
    description: string;
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    payload?: Record<string, any>;
    authentication?: {
      type: 'none' | 'bearer' | 'basic' | 'api_key';
      token?: string;
      username?: string;
      password?: string;
      apiKey?: string;
      apiKeyHeader?: string;
    };
    responseMapping?: Record<string, any>;
  };
}

// Edge interface
export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  condition?: {
    field: string;
    operator: string;
    value: string | number | boolean;
  };
  label?: string;
}

// Workflow interface
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: (TriggerNode | ActionNode | FormNode | WaitNode | ConditionNode | WebhookNode)[];
  edges: Edge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
  metadata?: {
    version?: string;
    author?: string;
    tags?: string[];
    category?: string;
  };
  settings?: {
    isActive?: boolean;
    runOn?: 'creation' | 'update' | 'manual';
    errorHandling?: {
      continueOnError?: boolean;
      maxRetries?: number;
      retryDelay?: number;
    };
  };
}

// Node type union
export type NodeType = TriggerNode | ActionNode | FormNode | WaitNode | ConditionNode | WebhookNode;

// Node type options for UI
export const NODE_TYPES = {
  TRIGGER: 'trigger',
  ACTION: 'action',
  FORM: 'form',
  WAIT: 'wait',
  CONDITION: 'condition',
  WEBHOOK: 'webhook'
} as const;

// Trigger type options
export const TRIGGER_TYPES = {
  TAG_ADDED: 'tag_added',
  FORM_SUBMISSION: 'form_submission',
  WEBHOOK: 'webhook',
  CONTACT_CREATED: 'contact_created',
  CONTACT_UPDATED: 'contact_updated'
} as const;

// Action type options
export const ACTION_TYPES = {
  SEND_EMAIL: 'send_email',
  SEND_SMS: 'send_sms',
  ADD_TAG: 'add_tag',
  REMOVE_TAG: 'remove_tag',
  CREATE_TASK: 'create_task',
  UPDATE_CONTACT: 'update_contact'
} as const;

// Form field type options
export const FORM_FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  NUMBER: 'number',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio'
} as const;

// Wait type options
export const WAIT_TYPES = {
  DELAY: 'delay',
  UNTIL: 'until',
  DATE: 'date'
} as const;

// Condition type options
export const CONDITION_TYPES = {
  IF_FIELD_EQUALS: 'if_field_equals',
  IF_TAG_EXISTS: 'if_tag_exists',
  IF_DATE_PASSED: 'if_date_passed',
  IF_CUSTOM: 'if_custom'
} as const;

// Condition operator options
export const CONDITION_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  CONTAINS: 'contains',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than'
} as const;

// HTTP method options
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
} as const;

// Authentication type options
export const AUTH_TYPES = {
  NONE: 'none',
  BEARER: 'bearer',
  BASIC: 'basic',
  API_KEY: 'api_key'
} as const;

// Workflow run options
export const RUN_ON_OPTIONS = {
  CREATION: 'creation',
  UPDATE: 'update',
  MANUAL: 'manual'
} as const;

// Mock example workflow
export const mockWorkflow: Workflow = {
  id: "workflow-001",
  name: "New Contact Welcome Sequence",
  description: "Automated welcome sequence for new contacts",
  nodes: [
    {
      id: "node-001",
      type: "trigger",
      position: { x: 100, y: 100 },
      data: {
        label: "When Contact is Created",
        description: "Starts when a new contact is created",
        triggerType: "contact_created"
      }
    },
    {
      id: "node-002",
      type: "action",
      position: { x: 300, y: 100 },
      data: {
        label: "Send Welcome Email",
        description: "Send a welcome email to the new contact",
        actionType: "send_email",
        emailConfig: {
          to: "{{contact.email}}",
          subject: "Welcome to Our Service!",
          body: "Hi {{contact.firstName}},\n\nWelcome to our service. We're excited to have you on board!"
        }
      }
    },
    {
      id: "node-003",
      type: "wait",
      position: { x: 500, y: 100 },
      data: {
        label: "Wait 24 Hours",
        description: "Wait for 24 hours before next action",
        waitType: "delay",
        delayAmount: 24,
        delayUnit: "hours"
      }
    },
    {
      id: "node-004",
      type: "action",
      position: { x: 700, y: 100 },
      data: {
        label: "Send Follow-up Email",
        description: "Send a follow-up email after 24 hours",
        actionType: "send_email",
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
