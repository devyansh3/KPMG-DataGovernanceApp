const SECRET_KEY =
  "AzjcUx5izCXq353934fi3eitkUf4L43YavpLzC6rjxFCmajBjHut9S2E4Y89tcXTfbcUT7qP9vRK8mPr4NsLTg7eSfcWPx8kfXx2ofMb6XREHGnMS4DVkHgkKXKo6UxC";

const ERROR_MESSAGES = {
  INVALID_DATE: '"Date" value/format is invalid.',
  INVALID_URL: "URL is invalid.",
  COMMON_ERROR_MESSAGE: "Something went wrong.",
  INVALID_REQUEST: "Invalid Request.",
  TOKEN_EXPIRED:
    "Link Expired, please raise a new request to reset your password.",
  USER_ALREADY_EXISTS: "User already registered, please login to continue.",
  ACCOUNT_NOT_ACTIVATED:
    "Account not activated, please check your email for the link.",
  INVALID_CREDENTIALS:
    "Sorry, your mobile number and/or password is incorrect. Please try again.",
  CORS_ERROR: "Not allowed by CORS.",
  ACCOUNT_NOT_ACTIVATED:
    "Your account is not activated yet, please check your email.",
  INVALID_ACCESS: "Access not allowed.",
  USED_ROLLS: "Some rolls are already used.",
  UNAVAILABLE_ROLLS: "Some rolls are not available.",
  LABOUR_NOT_FOUND: "Labour not found.",
  ISSUE_NOT_FOUND: "Issue not found.",
  INVALID_ISSUE_STATUS: "Issue status should be OPEN to resolve issue.",
  ROLLS_ISSUE_MISMATCH: "Rolls do not match with issue.",
  INVALID_CONSUMED_QTY: "Consumed quantity is more than issued quantity.",
  FABRIC_ISSUE_NOT_FOUND: "Fabric issue not found.",
  FABRIC_ISSUE_NOT_RESOLVED: "Fabric issue is not in resolved state.",
  UNKNOWN_SHADES: "Unknown shades found during lot generation.",
  DUPLICATE_KEY: "Duplicate key error",
  LOT_NOT_FOUND: "Lot not found.",
  ISSUE_ALREADY_RESOLVED: "Issue is already resolved.",
  RECIEVED_PCS_GREATER_THAN_TOTAL_PCS:
    "Recieved pcs should be less than total pcs.",
  DUPLICATE_BUNDLES: "Bundles should be unique.",
  INVALID_BUNDLE_COUNT: "Bundle count should be equal to lot bundle count.",
  INVALID_BUNDLES: "Bundle ids do not match with lot bundles.",
  SUPPLIER_NOT_FOUND: "Supplier not found.",
  BUYER_NOT_FOUND: "Buyer not found.",
  TOTAL_SETS_EXCEEDS: "Total sets exceeds total pcs.",
  SET_NOT_FOUND: "Set not found.",
  TOTAL_SETS_EXCEEDS_AVAILABLE_SETS: "Total sets exceeds available sets.",
  TOTAL_LOOSE_PCS_EXCEEDS_AVAILABLE_LOOSE_PCS:
    "Total loose pcs exceeds available loose pcs.",
  TRADING_ORDER_NOT_FOUND: "Trading order not found.",
  PREVIOUS_PIPELINES_NOT_RESOLVED: "Please resolve other issuances.",
};

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNSUPPORTED_MEDIA_TYPE: 415,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIME_OUT: 504,
};

const ROLES = {
  SUPERADMIN: "SuperAdmin",
  ADMIN: "admin",
  ASSOCIATE: "Associate",
};

const ALLOWED_SUB_ROLES = [ROLES.ADMIN, ROLES.ASSOCIATE];

const BOOKING_STATUS = {
  OPEN: "Open",
  TRIAL_DONE: "Trial Done",
  DELIVERY_DONE: "Delivery Done",
  DRAFT: "Draft",
  CANCELLED: "Cancelled",
};

const COLORS = {
  beige: "BEI",
  black: "BLK",
  blue: "BLU",
  brown: "BRN",
  chocolate: "CHO",
  gold: "GLD",
  gray: "GRY",
  green: "GRN",
  indigo: "IND",
  khaki: "KHA",
  lavender: "LAV",
  lime: "LIM",
  magenta: "MAG",
  maroon: "MAR",
  mustard: "MUS",
  navy: "NAV",
  olive: "OLV",
  orange: "ORG",
  pink: "PNK",
  purple: "PUR",
  red: "RED",
  silver: "SIL",
  teal: "TEA",
  turquoise: "TUR",
  violet: "VIO",
  white: "WHT",
  yellow: "YEL",
};

TRANSACTION_TYPES = {
  SALE: "SALE",
  PURCHASE: "PURCHASE",
  INITIAL_PAYMENT: "INITIAL PAYMENT",
  DUE_CLEARANCE: "DUE CLEARANCE",
  RETURN: "RETURN",
  INITIAL_BALANCE: "INITIAL BALANCE",
  MANUAL_ADJUSTMENT: "MANUAL ADJUSTMENT",
  DEDUCTION: "DEDUCTION",
  LABOUR_CHARGES: "LABOUR CHARGES",
};

const SIZES = {
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
  XXL: "2XL",
  XXXL: "3XL",
  IVXL: "4XL",
  VXL: "5XL",
  0: "0",
  2: "2",
  4: "4",
  6: "6",
  8: "8",
  10: "10",
  12: "12",
  14: "14",
  16: "16",
  18: "18",
  20: "20",
  22: "22",
  24: "24",
  26: "26",
  28: "28",
  30: "30",
  32: "32",
  34: "34",
  36: "36",
  38: "38",
  40: "40",
  42: "42",
  44: "44",
  46: "46",
  48: "48",
  50: "50",
  52: "52",
  54: "54",
  56: "56",
};

// Exporting modules using CommonJS syntax
module.exports = {
  ERROR_MESSAGES,
  STATUS_CODES,
  ROLES,
  BOOKING_STATUS,
  SECRET_KEY,
  ALLOWED_SUB_ROLES,
};
