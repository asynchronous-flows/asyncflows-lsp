export default {
  "$defs": {
    "Blob_": {
      "properties": {
        "id": {
          "title": "Id",
          "type": "string"
        },
        "file_extension": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "File Extension"
        }
      },
      "required": [
        "id"
      ],
      "title": "Blob_",
      "type": "object"
    },
    "EnvDeclaration": {
      "additionalProperties": false,
      "description": "An env declaration is a string that references an environment variable.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "env": {
          "title": "Env",
          "type": "string"
        }
      },
      "required": [
        "env"
      ],
      "title": "EnvDeclaration",
      "type": "object"
    },
    "File_": {
      "properties": {
        "sources": {
          "items": {
            "anyOf": [
              {
                "$ref": "#/$defs/Blob_"
              },
              {
                "type": "string"
              }
            ]
          },
          "title": "Sources",
          "type": "array"
        }
      },
      "required": [
        "sources"
      ],
      "title": "File_",
      "type": "object"
    },
    "HintedLoop": {
      "additionalProperties": false,
      "properties": {
        "for": {
          "title": "For",
          "type": "string"
        },
        "in": {
          "anyOf": [
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "In"
        },
        "flow": {
          "additionalProperties": {
            "anyOf": [
              {
                "$ref": "#/$defs/HintedLoop"
              },
              {
                "$ref": "#/$defs/extract_listActionInvocation"
              },
              {
                "$ref": "#/$defs/extract_pdf_textActionInvocation"
              },
              {
                "$ref": "#/$defs/extract_xml_tagActionInvocation"
              },
              {
                "$ref": "#/$defs/execute_db_statementActionInvocation"
              },
              {
                "$ref": "#/$defs/ocrActionInvocation"
              },
              {
                "$ref": "#/$defs/get_db_schemaActionInvocation"
              },
              {
                "$ref": "#/$defs/retrieveActionInvocation"
              },
              {
                "$ref": "#/$defs/rerankActionInvocation"
              },
              {
                "$ref": "#/$defs/promptActionInvocation"
              },
              {
                "$ref": "#/$defs/get_urlActionInvocation"
              },
              {
                "$ref": "#/$defs/scoreActionInvocation"
              }
            ]
          },
          "title": "Flow",
          "type": "object"
        }
      },
      "required": [
        "for",
        "in",
        "flow"
      ],
      "title": "HintedLoop",
      "type": "object"
    },
    "LambdaDeclaration": {
      "additionalProperties": false,
      "description": "A lambda declaration is a python expression that can be evaluated within a context.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "lambda": {
          "title": "Lambda",
          "type": "string"
        }
      },
      "required": [
        "lambda"
      ],
      "title": "LambdaDeclaration",
      "type": "object"
    },
    "LinkDeclaration": {
      "additionalProperties": false,
      "description": "An link declaration is a string that references another action's output",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "link": {
          "title": "Link",
          "type": "string"
        }
      },
      "required": [
        "link"
      ],
      "title": "LinkDeclaration",
      "type": "object"
    },
    "ModelConfigDeclaration": {
      "additionalProperties": false,
      "properties": {
        "max_output_tokens": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            }
          ],
          "default": 2000,
          "title": "Max Output Tokens"
        },
        "max_prompt_tokens": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            }
          ],
          "default": 8000,
          "title": "Max Prompt Tokens"
        },
        "temperature": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Temperature"
        },
        "top_p": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Top P"
        },
        "frequency_penalty": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Frequency Penalty"
        },
        "presence_penalty": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Presence Penalty"
        },
        "model": {
          "anyOf": [
            {
              "enum": [
                "ollama/llama3",
                "ollama/llama3:8b",
                "ollama/llama3:70b",
                "ollama/gemma",
                "ollama/gemma:2b",
                "ollama/gemma:7b",
                "ollama/mixtral",
                "ollama/mixtral:8x7b",
                "ollama/mixtral:8x22b"
              ],
              "type": "string"
            },
            {
              "enum": [
                "gpt-4o",
                "gpt-4-1106-preview",
                "gpt-4",
                "gpt-4-turbo",
                "gpt-3.5-turbo-16k",
                "gpt-3.5-turbo-1106",
                "gpt-3.5-turbo"
              ],
              "type": "string"
            },
            {
              "const": "gemini-pro",
              "enum": [
                "gemini-pro"
              ],
              "type": "string"
            },
            {
              "enum": [
                "claude-3-haiku-20240307",
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229"
              ],
              "type": "string"
            },
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            }
          ],
          "default": "ollama/llama3",
          "title": "Model"
        },
        "api_base": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Api Base"
        },
        "auth_token": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Auth Token"
        }
      },
      "title": "ModelConfigDeclaration",
      "type": "object"
    },
    "OptionalModelConfigActionFieldTemplate": {
      "additionalProperties": false,
      "properties": {
        "max_output_tokens": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Max Output Tokens"
        },
        "max_prompt_tokens": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Max Prompt Tokens"
        },
        "temperature": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Temperature"
        },
        "top_p": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Top P"
        },
        "frequency_penalty": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Frequency Penalty"
        },
        "presence_penalty": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Presence Penalty"
        },
        "model": {
          "anyOf": [
            {
              "enum": [
                "ollama/llama3",
                "ollama/llama3:8b",
                "ollama/llama3:70b",
                "ollama/gemma",
                "ollama/gemma:2b",
                "ollama/gemma:7b",
                "ollama/mixtral",
                "ollama/mixtral:8x7b",
                "ollama/mixtral:8x22b"
              ],
              "type": "string"
            },
            {
              "enum": [
                "gpt-4o",
                "gpt-4-1106-preview",
                "gpt-4",
                "gpt-4-turbo",
                "gpt-3.5-turbo-16k",
                "gpt-3.5-turbo-1106",
                "gpt-3.5-turbo"
              ],
              "type": "string"
            },
            {
              "const": "gemini-pro",
              "enum": [
                "gemini-pro"
              ],
              "type": "string"
            },
            {
              "enum": [
                "claude-3-haiku-20240307",
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229"
              ],
              "type": "string"
            },
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Model"
        },
        "api_base": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Api Base"
        },
        "auth_token": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Auth Token"
        }
      },
      "title": "OptionalModelConfigActionFieldTemplate",
      "type": "object"
    },
    "PromptContextInConfigLambda": {
      "additionalProperties": false,
      "description": "A lambda declaration for prompt context in config.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "lambda": {
          "title": "Lambda",
          "type": "string"
        },
        "heading": {
          "title": "Heading",
          "type": "string"
        }
      },
      "required": [
        "lambda",
        "heading"
      ],
      "title": "PromptContextInConfigLambda",
      "type": "object"
    },
    "PromptContextInConfigLink": {
      "additionalProperties": false,
      "description": "An input declaration for prompt context in config.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "link": {
          "title": "Link",
          "type": "string"
        },
        "heading": {
          "title": "Heading",
          "type": "string"
        }
      },
      "required": [
        "link",
        "heading"
      ],
      "title": "PromptContextInConfigLink",
      "type": "object"
    },
    "PromptContextInConfigTemplate": {
      "additionalProperties": false,
      "description": "A template string for prompt context in config.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "text": {
          "title": "Text",
          "type": "string"
        },
        "heading": {
          "title": "Heading",
          "type": "string"
        }
      },
      "required": [
        "text",
        "heading"
      ],
      "title": "PromptContextInConfigTemplate",
      "type": "object"
    },
    "PromptContextInConfigVar": {
      "additionalProperties": false,
      "description": "A variable declaration for prompt context in config.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "var": {
          "title": "Var",
          "type": "string"
        },
        "heading": {
          "title": "Heading",
          "type": "string"
        }
      },
      "required": [
        "var",
        "heading"
      ],
      "title": "PromptContextInConfigVar",
      "type": "object"
    },
    "QuoteStyle": {
      "enum": [
        "backticks",
        "xml"
      ],
      "title": "QuoteStyle",
      "type": "string"
    },
    "RoleElement_": {
      "additionalProperties": false,
      "properties": {
        "role": {
          "enum": [
            "user",
            "system",
            "assistant"
          ],
          "title": "Role",
          "type": "string"
        }
      },
      "required": [
        "role"
      ],
      "title": "RoleElement_",
      "type": "object"
    },
    "TextDeclaration": {
      "additionalProperties": false,
      "description": "A template declaration is a string that can be rendered within a context.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "text": {
          "title": "Text",
          "type": "string"
        }
      },
      "required": [
        "text"
      ],
      "title": "TextDeclaration",
      "type": "object"
    },
    "TextElement_": {
      "additionalProperties": false,
      "properties": {
        "text": {
          "title": "Text",
          "type": "string"
        },
        "role": {
          "anyOf": [
            {
              "enum": [
                "user",
                "system",
                "assistant"
              ],
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Role"
        }
      },
      "required": [
        "text"
      ],
      "title": "TextElement_",
      "type": "object"
    },
    "VarDeclaration": {
      "additionalProperties": false,
      "description": "A variable declaration is a string that references a variable (or path to nested variable) in the context.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "var": {
          "title": "Var",
          "type": "string"
        }
      },
      "required": [
        "var"
      ],
      "title": "VarDeclaration",
      "type": "object"
    },
    "execute_db_statementActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "execute_db_statement",
          "enum": [
            "execute_db_statement"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "database_url": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Database Url"
        },
        "statement": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Statement"
        },
        "allowed_statement_prefixes": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "default": [
            "SELECT"
          ],
          "title": "Allowed Statement Prefixes"
        },
        "max_rows": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "default": 5,
          "title": "Max Rows"
        }
      },
      "required": [
        "action",
        "database_url",
        "statement"
      ],
      "title": "execute_db_statementActionInvocation",
      "type": "object"
    },
    "extract_listActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "extract_list",
          "enum": [
            "extract_list"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "text": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Text"
        },
        "valid_values": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Valid Values"
        },
        "list_format": {
          "anyOf": [
            {
              "enum": [
                "comma",
                "newline",
                "space",
                "bullet points"
              ],
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "default": "bullet points",
          "title": "List Format"
        }
      },
      "required": [
        "action",
        "text"
      ],
      "title": "extract_listActionInvocation",
      "type": "object"
    },
    "extract_pdf_textActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "extract_pdf_text",
          "enum": [
            "extract_pdf_text"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "file": {
          "anyOf": [
            {
              "$ref": "#/$defs/File_"
            },
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "File"
        },
        "min_start_chars": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "default": 1000,
          "title": "Min Start Chars"
        }
      },
      "required": [
        "action",
        "file"
      ],
      "title": "extract_pdf_textActionInvocation",
      "type": "object"
    },
    "extract_xml_tagActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "extract_xml_tag",
          "enum": [
            "extract_xml_tag"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "text": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Text"
        },
        "tag": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Tag"
        }
      },
      "required": [
        "action",
        "text",
        "tag"
      ],
      "title": "extract_xml_tagActionInvocation",
      "type": "object"
    },
    "get_db_schemaActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "get_db_schema",
          "enum": [
            "get_db_schema"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "database_url": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Database Url"
        }
      },
      "required": [
        "action",
        "database_url"
      ],
      "title": "get_db_schemaActionInvocation",
      "type": "object"
    },
    "get_urlActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "get_url",
          "enum": [
            "get_url"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "url": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Url"
        }
      },
      "required": [
        "action",
        "url"
      ],
      "title": "get_urlActionInvocation",
      "type": "object"
    },
    "ocrActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "ocr",
          "enum": [
            "ocr"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "pdf": {
          "anyOf": [
            {
              "$ref": "#/$defs/File_"
            },
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Pdf"
        }
      },
      "required": [
        "action",
        "pdf"
      ],
      "title": "ocrActionInvocation",
      "type": "object"
    },
    "promptActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "prompt",
          "enum": [
            "prompt"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "model": {
          "anyOf": [
            {
              "$ref": "#/$defs/OptionalModelConfigActionFieldTemplate"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Model"
        },
        "quote_style": {
          "anyOf": [
            {
              "$ref": "#/$defs/QuoteStyle"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Quote Style"
        },
        "prompt": {
          "anyOf": [
            {
              "items": {
                "anyOf": [
                  {
                    "$ref": "#/$defs/RoleElement_"
                  },
                  {
                    "$ref": "#/$defs/TextElement_"
                  },
                  {
                    "$ref": "#/$defs/PromptContextInConfigVar"
                  },
                  {
                    "$ref": "#/$defs/PromptContextInConfigLink"
                  },
                  {
                    "$ref": "#/$defs/PromptContextInConfigTemplate"
                  },
                  {
                    "$ref": "#/$defs/PromptContextInConfigLambda"
                  }
                ]
              },
              "type": "array"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Prompt"
        }
      },
      "required": [
        "action",
        "prompt"
      ],
      "title": "promptActionInvocation",
      "type": "object"
    },
    "rerankActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "rerank",
          "enum": [
            "rerank"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "model": {
          "anyOf": [
            {
              "enum": [
                "cross-encoder/ms-marco-TinyBERT-L-2-v2",
                "BAAI/bge-reranker-base"
              ],
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "default": "cross-encoder/ms-marco-TinyBERT-L-2-v2",
          "title": "Model"
        },
        "device": {
          "anyOf": [
            {
              "enum": [
                "cpu",
                "cuda",
                "mps",
                "tensorrt"
              ],
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Device"
        },
        "documents": {
          "anyOf": [
            {
              "items": {},
              "type": "array"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Documents"
        },
        "texts": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Texts"
        },
        "query": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Query"
        },
        "k": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "default": 10,
          "title": "K"
        }
      },
      "required": [
        "action",
        "documents",
        "query"
      ],
      "title": "rerankActionInvocation",
      "type": "object"
    },
    "retrieveActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "retrieve",
          "enum": [
            "retrieve"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "model": {
          "anyOf": [
            {
              "enum": [
                "sentence-transformers/all-mpnet-base-v2",
                "BAAI/bge-small-en-v1.5"
              ],
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "default": "sentence-transformers/all-mpnet-base-v2",
          "title": "Model"
        },
        "device": {
          "anyOf": [
            {
              "enum": [
                "cpu",
                "cuda",
                "mps",
                "tensorrt"
              ],
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Device"
        },
        "documents": {
          "anyOf": [
            {
              "items": {},
              "type": "array"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Documents"
        },
        "texts": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Texts"
        },
        "query": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Query"
        },
        "k": {
          "anyOf": [
            {
              "type": "integer"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "default": 10,
          "title": "K"
        }
      },
      "required": [
        "action",
        "documents",
        "query"
      ],
      "title": "retrieveActionInvocation",
      "type": "object"
    },
    "scoreActionInvocation": {
      "additionalProperties": false,
      "properties": {
        "action": {
          "const": "score",
          "enum": [
            "score"
          ],
          "title": "Action",
          "type": "string"
        },
        "cache_key": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Cache Key"
        },
        "mutated_response_output": {
          "anyOf": [
            {
              "items": {},
              "type": "array"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Mutated Response Output"
        },
        "expected_output": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/$defs/VarDeclaration"
            },
            {
              "$ref": "#/$defs/LinkDeclaration"
            },
            {
              "$ref": "#/$defs/TextDeclaration"
            },
            {
              "$ref": "#/$defs/EnvDeclaration"
            },
            {
              "$ref": "#/$defs/LambdaDeclaration"
            }
          ],
          "title": "Expected Output"
        }
      },
      "required": [
        "action",
        "mutated_response_output",
        "expected_output"
      ],
      "title": "scoreActionInvocation",
      "type": "object"
    }
  },
  "additionalProperties": false,
  "properties": {
    "default_model": {
      "$ref": "#/$defs/ModelConfigDeclaration"
    },
    "action_timeout": {
      "default": 360,
      "title": "Action Timeout",
      "type": "number"
    },
    "flow": {
      "additionalProperties": {
        "anyOf": [
          {
            "$ref": "#/$defs/HintedLoop"
          },
          {
            "$ref": "#/$defs/extract_listActionInvocation"
          },
          {
            "$ref": "#/$defs/extract_pdf_textActionInvocation"
          },
          {
            "$ref": "#/$defs/extract_xml_tagActionInvocation"
          },
          {
            "$ref": "#/$defs/execute_db_statementActionInvocation"
          },
          {
            "$ref": "#/$defs/ocrActionInvocation"
          },
          {
            "$ref": "#/$defs/get_db_schemaActionInvocation"
          },
          {
            "$ref": "#/$defs/retrieveActionInvocation"
          },
          {
            "$ref": "#/$defs/rerankActionInvocation"
          },
          {
            "$ref": "#/$defs/promptActionInvocation"
          },
          {
            "$ref": "#/$defs/get_urlActionInvocation"
          },
          {
            "$ref": "#/$defs/scoreActionInvocation"
          }
        ]
      },
      "title": "Flow",
      "type": "object"
    },
    "default_output": {
      "title": "Default Output",
      "type": "string"
    }
  },
  "required": [
    "default_model",
    "flow",
    "default_output"
  ],
  "title": "HintedActionConfig",
  "type": "object"
}
