/**
 * Workflow JSDoc Types for GoHighLevel-like CRM
 * 
 * These JSDoc types define the structure for workflows in the frontend.
 * They match the schema defined in backend/src/utils/workflowSchema.js
 */

// Base node type
/**
 * @typedef {object} BaseNode
 * @property {string} id - Unique identifier for the node
 * @property {'trigger' | 'action' | 'form' | 'wait' | 'condition' | 'webhook'} type - Type of the node
 * @property {{x: number, y: number}} position - Position on the canvas
 * @property {object} data - Node-specific configuration data
 * @property {object} [config] - Additional configuration for the node
 */

// Trigger node type
/**
 * @typedef {BaseNode} TriggerNode
 * @property {'trigger'} type
 * @property {object} data
 * @property {string} data.label - Display label for the node
 * @property {string} data.description - Description of the trigger
 * @property {'tag_added' | 'form_submission' | 'webhook' | 'contact_created' | 'contact_updated'} data.triggerType - Type of trigger event
 * @property {string} [data.tagId] - Tag ID for tag_added trigger
 * @property {string} [data.formId] - Form ID for form_submission trigger
 * @property {string} [data.webhookUrl] - Webhook URL for webhook trigger
 */

// Action node type
/**
 * @typedef {BaseNode} ActionNode
 * @property {'action'} type
 * @property {object} data
 * @property {string} data.label - Display label for the node
 * @property {string} data.description - Description of the action
 * @property {'send_email' | 'send_sms' | 'add_tag' | 'remove_tag' | 'create_task' | 'update_contact'} data.actionType - Type of action
 * @property {object} [data.emailConfig] - Email configuration
 * @property {string} data.emailConfig.to - Recipient email
 * @property {string} data.emailConfig.subject - Email subject
 * @property {string} data.emailConfig.body - Email body
 * @property {string} [data.emailConfig.templateId] - Email template ID
 * @property {object} [data.smsConfig] - SMS configuration
 * @property {string} data.smsConfig.to - Recipient phone
 * @property {string} data.smsConfig.message - SMS message
 * @property {object} [data.tagConfig] - Tag configuration
 * @property {string} data.tagConfig.tagId - Tag ID to add/remove
 * @property {string} [data.tagConfig.tagName] - Tag name
 * @property {object} [data.taskConfig] - Task configuration
 * @property {string} data.taskConfig.title - Task title
 * @property {string} [data.taskConfig.description] - Task description
 * @property {string} [data.taskConfig.dueDate] - Due date
 * @property {string} [data.taskConfig.assigneeId] - Assignee ID
 * @property {object} [data.contactUpdateConfig] - Contact update configuration
 * @property {string} data.contactUpdateConfig.field - Field to update
 * @property {string|number|boolean} data.contactUpdateConfig.value - Value to set
 */

// Form field type
/**
 * @typedef {object} FormField
 * @property {string} id - Unique field identifier
 * @property {string} name - Field name
 * @property {'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio'} type - Field type
 * @property {boolean} [required] - Whether field is required
 * @property {string[]} [options] - Options for select, checkbox, or radio
 * @property {object} [validation] - Field validation rules
 * @property {number} [validation.min] - Minimum value/length
 * @property {number} [validation.max] - Maximum value/length
 * @property {string} [validation.pattern] - Validation regex pattern
 */

// Form node type
/**
 * @typedef {BaseNode} FormNode
 * @property {'form'} type
 * @property {object} data
 * @property {string} data.label - Display label for the node
 * @property {string} data.description - Description of the form
 * @property {string} data.formTitle - Form title
 * @property {FormField[]} data.formFields - Array of form fields
 * @property {string} [data.submitButtonText] - Submit button text
 */

// Wait node type
/**
 * @typedef {BaseNode} WaitNode
 * @property {'wait'} type
 * @property {object} data
 * @property {string} data.label - Display label for the node
 * @property {string} data.description - Description of the wait
 * @property {'delay' | 'until' | 'date'} data.waitType - Type of wait condition
 * @property {number} [data.delayAmount] - Number of time units to wait
 * @property {'minutes' | 'hours' | 'days' | 'weeks'} [data.delayUnit] - Unit of time for delay
 * @property {string} [data.waitUntil] - Date/time to wait until
 * @property {string} [data.specificDate] - Specific date to wait for
 */

// Condition node type
/**
 * @typedef {BaseNode} ConditionNode
 * @property {'condition'} type
 * @property {object} data
 * @property {string} data.label - Display label for the node
 * @property {string} data.description - Description of the condition
 * @property {'if_field_equals' | 'if_tag_exists' | 'if_date_passed' | 'if_custom'} data.conditionType - Type of condition
 * @property {string} [data.field] - Field to check
 * @property {'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'} [data.operator] - Comparison operator
 * @property {string|number|boolean} [data.value] - Value to compare against
 * @property {string} [data.tagId] - Tag to check for
 * @property {string} [data.dateField] - Date field to check
 * @property {number} [data.daysOffset] - Days offset from now
 * @property {string} [data.customLogic] - Custom logic expression
 */

// Webhook node type
/**
 * @typedef {BaseNode} WebhookNode
 * @property {'webhook'} type
 * @property {object} data
 * @property {string} data.label - Display label for the node
 * @property {string} data.description - Description of the webhook
 * @property {string} data.endpoint - Webhook endpoint URL
 * @property {'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'} [data.method] - HTTP method
 * @property {object} [data.headers] - HTTP headers
 * @property {object} [data.payload] - Request payload
 * @property {object} [data.authentication] - Authentication configuration
 * @property {'none' | 'bearer' | 'basic' | 'api_key'} data.authentication.type - Auth type
 * @property {string} [data.authentication.token] - Bearer token
 * @property {string} [data.authentication.username] - Basic auth username
 * @property {string} [data.authentication.password] - Basic auth password
 * @property {string} [data.authentication.apiKey] - API key
 * @property {string} [data.authentication.apiKeyHeader] - API key header name
 * @property {object} [data.responseMapping] - Response field mapping
 */

// Edge type
/**
 * @typedef {object} Edge
 * @property {string} id - Unique identifier for the edge
 * @property {string} source - ID of the source node
 * @property {string} target - ID of the target node
 * @property {string} [sourceHandle] - Handle ID of the source node
 * @property {string} [targetHandle] - Handle ID of the target node
 * @property {object} [condition] - Condition for edge traversal
 * @property {string} condition.field - Field to check
 * @property {string} condition.operator - Comparison operator
 * @property {string|number|boolean} condition.value - Value to compare against
 * @property {string} [label] - Label for the edge
 */

// Workflow type
/**
 * @typedef {object} Workflow
 * @property {string} id - Unique identifier for the workflow
 * @property {string} name - Name of the workflow
 * @property {string} [description] - Description of the workflow
 * @property {(TriggerNode|ActionNode|FormNode|WaitNode|ConditionNode|WebhookNode)[]} nodes - Array of nodes
 * @property {Edge[]} edges - Array of edges connecting nodes
 * @property {object} [viewport] - Canvas viewport state
 * @property {number} viewport.x - X position
 * @property {number} viewport.y - Y position
 * @property {number} viewport.zoom - Zoom level
 * @property {object} [metadata] - Additional workflow metadata
 * @property {string} [metadata.version] - Workflow version
 * @property {string} [metadata.author] - Workflow author
 * @property {string[]} [metadata.tags] - Workflow tags
 * @property {string} [metadata.category] - Workflow category
 * @property {object} [settings] - Workflow settings
 * @property {boolean} [settings.isActive] - Whether workflow is active
 * @property {'creation' | 'update' | 'manual'} [settings.runOn] - When to run the workflow
 * @property {object} [settings.errorHandling] - Error handling configuration
 * @property {boolean} [settings.errorHandling.continueOnError] - Continue on error
 * @property {number} [settings.errorHandling.maxRetries] - Maximum retry attempts
 * @property {number} [settings.errorHandling.retryDelay] - Delay between retries (seconds)
 */

// Node type union
/**
 * @typedef {TriggerNode|ActionNode|FormNode|WaitNode|ConditionNode|WebhookNode} NodeType
 */

// Node type constants
export const NODE_TYPES = {
  TRIGGER: 'trigger',
  ACTION: 'action',
  FORM: 'form',
  WAIT: 'wait',
  CONDITION: 'condition',
  WEBHOOK: 'webhook'
};

// Trigger type constants
export const TRIGGER_TYPES = {
  TAG_ADDED: 'tag_added',
  FORM_SUBMISSION: 'form_submission',
  WEBHOOK: 'webhook',
  CONTACT_CREATED: 'contact_created',
  CONTACT_UPDATED: 'contact_updated'
};

// Action type constants
export const ACTION_TYPES = {
  SEND_EMAIL: 'send_email',
  SEND_SMS: 'send_sms',
  ADD_TAG: 'add_tag',
  REMOVE_TAG: 'remove_tag',
  CREATE_TASK: 'create_task',
  UPDATE_CONTACT: 'update_contact'
};

// Form field type constants
export const FORM_FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  NUMBER: 'number',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio'
};

// Wait type constants
export const WAIT_TYPES = {
  DELAY: 'delay',
  UNTIL: 'until',
  DATE: 'date'
};

// Condition type constants
export const CONDITION_TYPES = {
  IF_FIELD_EQUALS: 'if_field_equals',
  IF_TAG_EXISTS: 'if_tag_exists',
  IF_DATE_PASSED: 'if_date_passed',
  IF_CUSTOM: 'if_custom'
};

// Condition operator constants
export const CONDITION_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  CONTAINS: 'contains',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than'
};

// HTTP method constants
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// Authentication type constants
export const AUTH_TYPES = {
  NONE: 'none',
  BEARER: 'bearer',
  BASIC: 'basic',
  API_KEY: 'api_key'
};

// Workflow run options
export const RUN_ON_OPTIONS = {
  CREATION: 'creation',
  UPDATE: 'update',
  MANUAL: 'manual'
};

// Mock example workflow
export const mockWorkflow = {
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
