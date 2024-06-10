export default {
  "$defs": {
    "Blob_": {
      "properties": {
        "id": {
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
          "title": "Id"
        },
        "file_extension": {
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
          "title": "File Extension"
        }
      },
      "required": [
        "id"
      ],
      "title": "Blob_",
      "type": "object"
    },
    "ContextLambda": {
      "additionalProperties": false,
      "description": "A lambda declaration for prompt context in config.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "lambda": {
          "description": "\nA lambda declaration is a python expression evaluated within the context of the flow and any provided variables.\nIf you reference an action's output, it will ensure that action runs before this one.\n",
          "markdownDescription": "\nA lambda declaration is a python expression evaluated within the context of the flow and any provided variables.  \nIf you reference an action's output, it will ensure that action runs before this one.\n\nReference variables or action outputs like:\n\n> ```yaml\n> lambda: |\n> ```\n> ```python\n>   \"My name is \" + name + \". The output of action_id is \" + action_id.output_name\n> ```\n\nYou can also use list comprehension and conditionals:\n\n> ```yaml\n> lambda: |\n> ```\n> ```python\n>   [item for item in items if item.name != 'foo']\n> ```\n",
          "title": "Lambda",
          "type": "string"
        },
        "heading": {
          "description": "The heading for the context element.",
          "markdownDescription": "\nThe heading for the context element.\n\nIf `quote_style` is set to `backticks`, the heading will be wrapped in backticks, according to the following jinja template:    \n\n> ~~~jinja\n> {{ heading }}\n> ```\n> {{ value }}\n> ```\n> ~~~\n\n\nIf `quote_style` is set to `xml`, the heading will be wrapped in XML tags, according to the following jinja template:\n\n> ```jinja\n> <{{ heading }}>\n> {{ value }}\n> </{{ heading }}>\n> ```\n\n",
          "title": "Heading",
          "type": "string"
        }
      },
      "required": [
        "lambda",
        "heading"
      ],
      "title": "ContextLambda",
      "type": "object"
    },
    "ContextLink": {
      "additionalProperties": false,
      "description": "An input declaration for prompt context in config.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "link": {
          "description": "A link declaration references another action's output, and ensures that action runs before this one.",
          "title": "Link",
          "type": "string"
        },
        "heading": {
          "description": "The heading for the context element.",
          "markdownDescription": "\nThe heading for the context element.\n\nIf `quote_style` is set to `backticks`, the heading will be wrapped in backticks, according to the following jinja template:    \n\n> ~~~jinja\n> {{ heading }}\n> ```\n> {{ value }}\n> ```\n> ~~~\n\n\nIf `quote_style` is set to `xml`, the heading will be wrapped in XML tags, according to the following jinja template:\n\n> ```jinja\n> <{{ heading }}>\n> {{ value }}\n> </{{ heading }}>\n> ```\n\n",
          "title": "Heading",
          "type": "string"
        }
      },
      "required": [
        "link",
        "heading"
      ],
      "title": "ContextLink",
      "type": "object"
    },
    "ContextTemplate": {
      "additionalProperties": false,
      "description": "A template string for prompt context in config.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "text": {
          "description": "\nA text declaration is a jinja2 template, rendered within the context of the flow and any provided variables.\nIf you reference an action's output, it will ensure that action runs before this one.\n\nFor more information, see the Jinja2 documentation: https://jinja.palletsprojects.com/en/3.0.x/templates/.\n",
          "markdownDescription": "\nA text declaration is a jinja2 template, rendered within the context of the flow and any provided variables.  \nIf you reference an action's output, it will ensure that action runs before this one.\n\nReference variables or action outputs like: \n\n> ```yaml\n> text: |\n> ```\n> ```jinja\n>   Hi {{ name }}, the output of action_id is {{ action_id.output_name }}\n> ```\n\nIt also supports advanced features such as loops and conditionals:\n\n> ```yaml\n> text: |\n> ```\n> ```jinja\n>   {% for item in items -%}\n>     {% if item.name != 'foo' -%}\n>     {{ item.name }}: {{ item.value }}\n>     {% endif %}\n>   {% endfor %}\n> ```\n\nFor more information, see the [Jinja2 documentation](https://jinja.palletsprojects.com/en/3.0.x/templates/).\n",
          "title": "Text",
          "type": "string"
        },
        "heading": {
          "description": "The heading for the context element.",
          "markdownDescription": "\nThe heading for the context element.\n\nIf `quote_style` is set to `backticks`, the heading will be wrapped in backticks, according to the following jinja template:    \n\n> ~~~jinja\n> {{ heading }}\n> ```\n> {{ value }}\n> ```\n> ~~~\n\n\nIf `quote_style` is set to `xml`, the heading will be wrapped in XML tags, according to the following jinja template:\n\n> ```jinja\n> <{{ heading }}>\n> {{ value }}\n> </{{ heading }}>\n> ```\n\n",
          "title": "Heading",
          "type": "string"
        }
      },
      "required": [
        "text",
        "heading"
      ],
      "title": "ContextTemplate",
      "type": "object"
    },
    "ContextVar": {
      "additionalProperties": false,
      "description": "A variable declaration for prompt context in config.",
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "var": {
          "description": "A variable declaration references a variable (or path to nested variable) in the context.",
          "title": "Var",
          "type": "string"
        },
        "heading": {
          "description": "The heading for the context element.",
          "markdownDescription": "\nThe heading for the context element.\n\nIf `quote_style` is set to `backticks`, the heading will be wrapped in backticks, according to the following jinja template:    \n\n> ~~~jinja\n> {{ heading }}\n> ```\n> {{ value }}\n> ```\n> ~~~\n\n\nIf `quote_style` is set to `xml`, the heading will be wrapped in XML tags, according to the following jinja template:\n\n> ```jinja\n> <{{ heading }}>\n> {{ value }}\n> </{{ heading }}>\n> ```\n\n",
          "title": "Heading",
          "type": "string"
        }
      },
      "required": [
        "var",
        "heading"
      ],
      "title": "ContextVar",
      "type": "object"
    },
    "EnvDeclaration": {
      "additionalProperties": false,
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "env": {
          "description": "An environment declaration references the name of an environment variable that is loaded during runtime.",
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
          "anyOf": [
            {
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
          "description": "List of blobs or URLs to download the file from",
          "title": "Sources"
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
                "$ref": "#/$defs/execute_db_statementActionInvocation"
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
                "$ref": "#/$defs/get_db_schemaActionInvocation"
              },
              {
                "$ref": "#/$defs/get_urlActionInvocation"
              },
              {
                "$ref": "#/$defs/ocrActionInvocation"
              },
              {
                "$ref": "#/$defs/promptActionInvocation"
              },
              {
                "$ref": "#/$defs/scoreActionInvocation"
              },
              {
                "$ref": "#/$defs/retrieveActionInvocation"
              },
              {
                "$ref": "#/$defs/rerankActionInvocation"
              },
              {
                "$ref": "#/$defs/HintedLoop"
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
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "lambda": {
          "description": "\nA lambda declaration is a python expression evaluated within the context of the flow and any provided variables.\nIf you reference an action's output, it will ensure that action runs before this one.\n",
          "markdownDescription": "\nA lambda declaration is a python expression evaluated within the context of the flow and any provided variables.  \nIf you reference an action's output, it will ensure that action runs before this one.\n\nReference variables or action outputs like:\n\n> ```yaml\n> lambda: |\n> ```\n> ```python\n>   \"My name is \" + name + \". The output of action_id is \" + action_id.output_name\n> ```\n\nYou can also use list comprehension and conditionals:\n\n> ```yaml\n> lambda: |\n> ```\n> ```python\n>   [item for item in items if item.name != 'foo']\n> ```\n",
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
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "link": {
          "description": "A link declaration references another action's output, and ensures that action runs before this one.",
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
    "ModelConfig_": {
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
              "description": "Run inference on [Ollama](https://ollama.com/); defaults `api_base` to `localhost:11434`",
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
              "description": "OpenAI model; requires `OPENAI_API_KEY` environment variable",
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
              "description": "Google model; requires `GCP_CREDENTIALS_64` environment variable (base64-encoded GCP credentials JSON)",
              "enum": [
                "gemini-pro"
              ],
              "type": "string"
            },
            {
              "description": "Anthropic model; requires `ANTHROPIC_API_KEY` environment variable",
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
      "title": "ModelConfig_",
      "type": "object"
    },
    "OptionalModelConfig_": {
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
              "description": "Run inference on [Ollama](https://ollama.com/); defaults `api_base` to `localhost:11434`",
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
              "description": "OpenAI model; requires `OPENAI_API_KEY` environment variable",
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
              "description": "Google model; requires `GCP_CREDENTIALS_64` environment variable (base64-encoded GCP credentials JSON)",
              "enum": [
                "gemini-pro"
              ],
              "type": "string"
            },
            {
              "description": "Anthropic model; requires `ANTHROPIC_API_KEY` environment variable",
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
      "title": "OptionalModelConfig_",
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
          "title": "Role"
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
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "text": {
          "description": "\nA text declaration is a jinja2 template, rendered within the context of the flow and any provided variables.\nIf you reference an action's output, it will ensure that action runs before this one.\n\nFor more information, see the Jinja2 documentation: https://jinja.palletsprojects.com/en/3.0.x/templates/.\n",
          "markdownDescription": "\nA text declaration is a jinja2 template, rendered within the context of the flow and any provided variables.  \nIf you reference an action's output, it will ensure that action runs before this one.\n\nReference variables or action outputs like: \n\n> ```yaml\n> text: |\n> ```\n> ```jinja\n>   Hi {{ name }}, the output of action_id is {{ action_id.output_name }}\n> ```\n\nIt also supports advanced features such as loops and conditionals:\n\n> ```yaml\n> text: |\n> ```\n> ```jinja\n>   {% for item in items -%}\n>     {% if item.name != 'foo' -%}\n>     {{ item.name }}: {{ item.value }}\n>     {% endif %}\n>   {% endfor %}\n> ```\n\nFor more information, see the [Jinja2 documentation](https://jinja.palletsprojects.com/en/3.0.x/templates/).\n",
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
          "description": "\nA text declaration is a jinja2 template, rendered within the context of the flow and any provided variables.\nIf you reference an action's output, it will ensure that action runs before this one.\n\nFor more information, see the Jinja2 documentation: https://jinja.palletsprojects.com/en/3.0.x/templates/.\n",
          "markdownDescription": "\nA text declaration is a jinja2 template, rendered within the context of the flow and any provided variables.  \nIf you reference an action's output, it will ensure that action runs before this one.\n\nReference variables or action outputs like: \n\n> ```yaml\n> text: |\n> ```\n> ```jinja\n>   Hi {{ name }}, the output of action_id is {{ action_id.output_name }}\n> ```\n\nIt also supports advanced features such as loops and conditionals:\n\n> ```yaml\n> text: |\n> ```\n> ```jinja\n>   {% for item in items -%}\n>     {% if item.name != 'foo' -%}\n>     {{ item.name }}: {{ item.value }}\n>     {% endif %}\n>   {% endfor %}\n> ```\n\nFor more information, see the [Jinja2 documentation](https://jinja.palletsprojects.com/en/3.0.x/templates/).\n",
          "title": "Text"
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
      "properties": {
        "stream": {
          "default": false,
          "title": "Stream",
          "type": "boolean"
        },
        "var": {
          "description": "A variable declaration references a variable (or path to nested variable) in the context.",
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
      "description": "INPUTS\n- `database_url`: str  \n  Database URL (asynchronous)\n- `statement`: str  \n  SQL statement to execute\n- `allowed_statement_prefixes`: list[str]  \n  List of allowed statement prefixes\n- `max_rows`: int  \n  Maximum number of rows to return\n\nOUTPUTS\n- `text`: str  \n  Result of the SQL statement\n- `data`: list[list[Any]]\n- `headers`: list[str]",
      "markdownDescription": "**Inputs**\n- `database_url`: str  \n  Database URL (asynchronous)\n- `statement`: str  \n  SQL statement to execute\n- `allowed_statement_prefixes`: list[str]  \n  List of allowed statement prefixes\n- `max_rows`: int  \n  Maximum number of rows to return\n\n**Outputs**\n- `text`: str  \n  Result of the SQL statement\n- `data`: list[list[Any]]\n- `headers`: list[str]",
      "properties": {
        "action": {
          "const": "execute_db_statement",
          "description": "INPUTS\n- `database_url`: str  \n  Database URL (asynchronous)\n- `statement`: str  \n  SQL statement to execute\n- `allowed_statement_prefixes`: list[str]  \n  List of allowed statement prefixes\n- `max_rows`: int  \n  Maximum number of rows to return\n\nOUTPUTS\n- `text`: str  \n  Result of the SQL statement\n- `data`: list[list[Any]]\n- `headers`: list[str]",
          "enum": [
            "execute_db_statement"
          ],
          "markdownDescription": "**Inputs**\n- `database_url`: str  \n  Database URL (asynchronous)\n- `statement`: str  \n  SQL statement to execute\n- `allowed_statement_prefixes`: list[str]  \n  List of allowed statement prefixes\n- `max_rows`: int  \n  Maximum number of rows to return\n\n**Outputs**\n- `text`: str  \n  Result of the SQL statement\n- `data`: list[list[Any]]\n- `headers`: list[str]\n\n---",
          "title": "Execute Db Statement Action",
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
          "description": "`database_url`: str  \n  Database URL (asynchronous)",
          "markdownDescription": "- `database_url`: str  \n  Database URL (asynchronous)\n\n---",
          "title": "Execute Db Statement Action Input"
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
          "description": "`statement`: str  \n  SQL statement to execute",
          "markdownDescription": "- `statement`: str  \n  SQL statement to execute\n\n---",
          "title": "Execute Db Statement Action Input"
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
          "description": "`allowed_statement_prefixes`: list[str]  \n  List of allowed statement prefixes",
          "markdownDescription": "- `allowed_statement_prefixes`: list[str]  \n  List of allowed statement prefixes\n\n---",
          "title": "Execute Db Statement Action Input"
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
          "description": "`max_rows`: int  \n  Maximum number of rows to return",
          "markdownDescription": "- `max_rows`: int  \n  Maximum number of rows to return\n\n---",
          "title": "Execute Db Statement Action Input"
        }
      },
      "required": [
        "action",
        "database_url",
        "statement"
      ],
      "title": "Execute Db Statement Action",
      "type": "object"
    },
    "extract_listActionInvocation": {
      "additionalProperties": false,
      "description": "INPUTS\n- `text`: str\n- `valid_values`: list[str] (optional)\n- `list_format`: 'comma' | 'newline' | 'space' | 'bullet points'\n\nOUTPUTS\n- `results`: list[str]",
      "markdownDescription": "**Inputs**\n- `text`: str\n- `valid_values`: list[str] (optional)\n- `list_format`: 'comma' | 'newline' | 'space' | 'bullet points'\n\n**Outputs**\n- `results`: list[str]",
      "properties": {
        "action": {
          "const": "extract_list",
          "description": "INPUTS\n- `text`: str\n- `valid_values`: list[str] (optional)\n- `list_format`: 'comma' | 'newline' | 'space' | 'bullet points'\n\nOUTPUTS\n- `results`: list[str]",
          "enum": [
            "extract_list"
          ],
          "markdownDescription": "**Inputs**\n- `text`: str\n- `valid_values`: list[str] (optional)\n- `list_format`: 'comma' | 'newline' | 'space' | 'bullet points'\n\n**Outputs**\n- `results`: list[str]\n\n---",
          "title": "Extract List Action",
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
          "description": "`text`: str",
          "markdownDescription": "- `text`: str\n\n---",
          "title": "Extract List Action Input"
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
          "description": "`valid_values`: list[str] (optional)",
          "markdownDescription": "- `valid_values`: list[str] (optional)\n\n---",
          "title": "Extract List Action Input"
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
          "description": "`list_format`: 'comma' | 'newline' | 'space' | 'bullet points'",
          "markdownDescription": "- `list_format`: 'comma' | 'newline' | 'space' | 'bullet points'\n\n---",
          "title": "Extract List Action Input"
        }
      },
      "required": [
        "action",
        "text"
      ],
      "title": "Extract List Action",
      "type": "object"
    },
    "extract_pdf_textActionInvocation": {
      "additionalProperties": false,
      "description": "INPUTS\n- `file`: File | str\n- `min_start_chars`: int\n\nOUTPUTS\n- `title`: str (optional)\n- `start_of_text`: str (optional)\n- `full_text`: str (optional)\n- `pages`: list[Page] (optional)",
      "markdownDescription": "**Inputs**\n- `file`: [File](file:///Users/rafael/asyncflows/asyncflows/models/file.py#L19) | str\n- `min_start_chars`: int\n\n**Outputs**\n- `title`: str (optional)\n- `start_of_text`: str (optional)\n- `full_text`: str (optional)\n- `pages`: list[[Page](file:///Users/rafael/asyncflows/asyncflows/actions/extract_pdf_text.py#L15)] (optional)",
      "properties": {
        "action": {
          "const": "extract_pdf_text",
          "description": "INPUTS\n- `file`: File | str\n- `min_start_chars`: int\n\nOUTPUTS\n- `title`: str (optional)\n- `start_of_text`: str (optional)\n- `full_text`: str (optional)\n- `pages`: list[Page] (optional)",
          "enum": [
            "extract_pdf_text"
          ],
          "markdownDescription": "**Inputs**\n- `file`: [File](file:///Users/rafael/asyncflows/asyncflows/models/file.py#L19) | str\n- `min_start_chars`: int\n\n**Outputs**\n- `title`: str (optional)\n- `start_of_text`: str (optional)\n- `full_text`: str (optional)\n- `pages`: list[[Page](file:///Users/rafael/asyncflows/asyncflows/actions/extract_pdf_text.py#L15)] (optional)\n\n---",
          "title": "Extract Pdf Text Action",
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
          "description": "`file`: File | str",
          "markdownDescription": "- `file`: [File](file:///Users/rafael/asyncflows/asyncflows/models/file.py#L19) | str\n\n---",
          "title": "Extract Pdf Text Action Input"
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
          "description": "`min_start_chars`: int",
          "markdownDescription": "- `min_start_chars`: int\n\n---",
          "title": "Extract Pdf Text Action Input"
        }
      },
      "required": [
        "action",
        "file"
      ],
      "title": "Extract Pdf Text Action",
      "type": "object"
    },
    "extract_xml_tagActionInvocation": {
      "additionalProperties": false,
      "description": "INPUTS\n- `text`: str  \n  Text to extract out of <tag>text</tag>\n- `tag`: str  \n  Tag to extract from\n\nOUTPUTS\n- `result`: str  \n  Text extracted from the tag",
      "markdownDescription": "**Inputs**\n- `text`: str  \n  Text to extract out of <tag>text</tag>\n- `tag`: str  \n  Tag to extract from\n\n**Outputs**\n- `result`: str  \n  Text extracted from the tag",
      "properties": {
        "action": {
          "const": "extract_xml_tag",
          "description": "INPUTS\n- `text`: str  \n  Text to extract out of <tag>text</tag>\n- `tag`: str  \n  Tag to extract from\n\nOUTPUTS\n- `result`: str  \n  Text extracted from the tag",
          "enum": [
            "extract_xml_tag"
          ],
          "markdownDescription": "**Inputs**\n- `text`: str  \n  Text to extract out of <tag>text</tag>\n- `tag`: str  \n  Tag to extract from\n\n**Outputs**\n- `result`: str  \n  Text extracted from the tag\n\n---",
          "title": "Extract Xml Tag Action",
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
          "description": "`text`: str  \n  Text to extract out of <tag>text</tag>",
          "markdownDescription": "- `text`: str  \n  Text to extract out of <tag>text</tag>\n\n---",
          "title": "Extract Xml Tag Action Input"
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
          "description": "`tag`: str  \n  Tag to extract from",
          "markdownDescription": "- `tag`: str  \n  Tag to extract from\n\n---",
          "title": "Extract Xml Tag Action Input"
        }
      },
      "required": [
        "action",
        "text",
        "tag"
      ],
      "title": "Extract Xml Tag Action",
      "type": "object"
    },
    "get_db_schemaActionInvocation": {
      "additionalProperties": false,
      "description": "INPUTS\n- `database_url`: str  \n  Database URL (synchronous)\n\nOUTPUTS\n- `schema_text`: str  \n  Text describing the database schema in `CREATE TABLE` statements",
      "markdownDescription": "**Inputs**\n- `database_url`: str  \n  Database URL (synchronous)\n\n**Outputs**\n- `schema_text`: str  \n  Text describing the database schema in `CREATE TABLE` statements",
      "properties": {
        "action": {
          "const": "get_db_schema",
          "description": "INPUTS\n- `database_url`: str  \n  Database URL (synchronous)\n\nOUTPUTS\n- `schema_text`: str  \n  Text describing the database schema in `CREATE TABLE` statements",
          "enum": [
            "get_db_schema"
          ],
          "markdownDescription": "**Inputs**\n- `database_url`: str  \n  Database URL (synchronous)\n\n**Outputs**\n- `schema_text`: str  \n  Text describing the database schema in `CREATE TABLE` statements\n\n---",
          "title": "Get Db Schema Action",
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
          "description": "`database_url`: str  \n  Database URL (synchronous)",
          "markdownDescription": "- `database_url`: str  \n  Database URL (synchronous)\n\n---",
          "title": "Get Db Schema Action Input"
        }
      },
      "required": [
        "action",
        "database_url"
      ],
      "title": "Get Db Schema Action",
      "type": "object"
    },
    "get_urlActionInvocation": {
      "additionalProperties": false,
      "description": "INPUTS\n- `url`: str  \n  URL of the webpage to GET\n\nOUTPUTS\n- `result`: str  \n  Text content of the webpage",
      "markdownDescription": "**Inputs**\n- `url`: str  \n  URL of the webpage to GET\n\n**Outputs**\n- `result`: str  \n  Text content of the webpage",
      "properties": {
        "action": {
          "const": "get_url",
          "description": "INPUTS\n- `url`: str  \n  URL of the webpage to GET\n\nOUTPUTS\n- `result`: str  \n  Text content of the webpage",
          "enum": [
            "get_url"
          ],
          "markdownDescription": "**Inputs**\n- `url`: str  \n  URL of the webpage to GET\n\n**Outputs**\n- `result`: str  \n  Text content of the webpage\n\n---",
          "title": "Get Url Action",
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
          "description": "`url`: str  \n  URL of the webpage to GET",
          "markdownDescription": "- `url`: str  \n  URL of the webpage to GET\n\n---",
          "title": "Get Url Action Input"
        }
      },
      "required": [
        "action",
        "url"
      ],
      "title": "Get Url Action",
      "type": "object"
    },
    "ocrActionInvocation": {
      "additionalProperties": false,
      "description": "INPUTS\n- `pdf`: File | str\n\nOUTPUTS\n- `pdf_ocr`: str",
      "markdownDescription": "**Inputs**\n- `pdf`: [File](file:///Users/rafael/asyncflows/asyncflows/models/file.py#L19) | str\n\n**Outputs**\n- `pdf_ocr`: str",
      "properties": {
        "action": {
          "const": "ocr",
          "description": "INPUTS\n- `pdf`: File | str\n\nOUTPUTS\n- `pdf_ocr`: str",
          "enum": [
            "ocr"
          ],
          "markdownDescription": "**Inputs**\n- `pdf`: [File](file:///Users/rafael/asyncflows/asyncflows/models/file.py#L19) | str\n\n**Outputs**\n- `pdf_ocr`: str\n\n---",
          "title": "Ocr Action",
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
          "description": "`pdf`: File | str",
          "markdownDescription": "- `pdf`: [File](file:///Users/rafael/asyncflows/asyncflows/models/file.py#L19) | str\n\n---",
          "title": "Ocr Action Input"
        }
      },
      "required": [
        "action",
        "pdf"
      ],
      "title": "Ocr Action",
      "type": "object"
    },
    "promptActionInvocation": {
      "additionalProperties": false,
      "description": "Prompt the LLM with a message and receive a response.\n\nINPUTS\n- `model`: OptionalModelConfig (optional)\n- `quote_style`: 'backticks' | 'xml' (optional)  \n  The quote style to use for the prompt. Defaults to XML-style quotes for Claude models and backticks for others.\n- `prompt`: list[RoleElement | TextElement | ContextVar | ContextLink | ContextTemplate | ContextLambda]\n\nOUTPUTS\n- `result`: str  \n  Response given by the LLM",
      "markdownDescription": "Prompt the LLM with a message and receive a response.\n\n**Inputs**\n- `model`: [OptionalModelConfig](file:///Users/rafael/asyncflows/asyncflows/models/config/model.py#L87) (optional)\n- `quote_style`: 'backticks' | 'xml' (optional)  \n  The quote style to use for the prompt. Defaults to XML-style quotes for Claude models and backticks for others.\n- `prompt`: list[[RoleElement](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L39) | [TextElement](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L49) | [ContextVar](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L206) | [ContextLink](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L212) | [ContextTemplate](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L218) | [ContextLambda](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L224)]\n\n**Outputs**\n- `result`: str  \n  Response given by the LLM",
      "properties": {
        "action": {
          "const": "prompt",
          "description": "Prompt the LLM with a message and receive a response.\n\nINPUTS\n- `model`: OptionalModelConfig (optional)\n- `quote_style`: 'backticks' | 'xml' (optional)  \n  The quote style to use for the prompt. Defaults to XML-style quotes for Claude models and backticks for others.\n- `prompt`: list[RoleElement | TextElement | ContextVar | ContextLink | ContextTemplate | ContextLambda]\n\nOUTPUTS\n- `result`: str  \n  Response given by the LLM",
          "enum": [
            "prompt"
          ],
          "markdownDescription": "Prompt the LLM with a message and receive a response.\n\n**Inputs**\n- `model`: [OptionalModelConfig](file:///Users/rafael/asyncflows/asyncflows/models/config/model.py#L87) (optional)\n- `quote_style`: 'backticks' | 'xml' (optional)  \n  The quote style to use for the prompt. Defaults to XML-style quotes for Claude models and backticks for others.\n- `prompt`: list[[RoleElement](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L39) | [TextElement](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L49) | [ContextVar](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L206) | [ContextLink](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L212) | [ContextTemplate](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L218) | [ContextLambda](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L224)]\n\n**Outputs**\n- `result`: str  \n  Response given by the LLM\n\n---",
          "title": "Prompt Action",
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
              "$ref": "#/$defs/OptionalModelConfig_"
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
          "description": "Prompt the LLM with a message and receive a response.\n\n`model`: OptionalModelConfig (optional)",
          "markdownDescription": "Prompt the LLM with a message and receive a response.\n\n- `model`: [OptionalModelConfig](file:///Users/rafael/asyncflows/asyncflows/models/config/model.py#L87) (optional)\n\n---",
          "title": "Prompt Action Input"
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
          "description": "Prompt the LLM with a message and receive a response.\n\n`quote_style`: 'backticks' | 'xml' (optional)  \n  The quote style to use for the prompt. Defaults to XML-style quotes for Claude models and backticks for others.",
          "markdownDescription": "Prompt the LLM with a message and receive a response.\n\n- `quote_style`: 'backticks' | 'xml' (optional)  \n  The quote style to use for the prompt. Defaults to XML-style quotes for Claude models and backticks for others.\n\n---",
          "title": "Prompt Action Input"
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
                    "$ref": "#/$defs/ContextVar"
                  },
                  {
                    "$ref": "#/$defs/ContextLink"
                  },
                  {
                    "$ref": "#/$defs/ContextTemplate"
                  },
                  {
                    "$ref": "#/$defs/ContextLambda"
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
          "description": "Prompt the LLM with a message and receive a response.\n\n`prompt`: list[RoleElement | TextElement | ContextVar | ContextLink | ContextTemplate | ContextLambda]",
          "markdownDescription": "Prompt the LLM with a message and receive a response.\n\n- `prompt`: list[[RoleElement](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L39) | [TextElement](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L49) | [ContextVar](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L206) | [ContextLink](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L212) | [ContextTemplate](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L218) | [ContextLambda](file:///Users/rafael/asyncflows/asyncflows/actions/utils/prompt_context.py#L224)]\n\n---",
          "title": "Prompt Action Input"
        }
      },
      "required": [
        "action",
        "prompt"
      ],
      "title": "Prompt Action",
      "type": "object"
    },
    "rerankActionInvocation": {
      "additionalProperties": false,
      "description": "INPUTS\n- `model`: 'cross-encoder/ms-marco-TinyBERT-L-2-v2' | 'BAAI/bge-reranker-base'\n- `device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)\n- `documents`: list[Any]\n- `texts`: None (optional)\n- `query`: str\n- `k`: int\n\nOUTPUTS\n- `result`: list[Any]",
      "markdownDescription": "**Inputs**\n- `model`: 'cross-encoder/ms-marco-TinyBERT-L-2-v2' | 'BAAI/bge-reranker-base'\n- `device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)\n- `documents`: list[Any]\n- `texts`: None (optional)\n- `query`: str\n- `k`: int\n\n**Outputs**\n- `result`: list[Any]",
      "properties": {
        "action": {
          "const": "rerank",
          "description": "INPUTS\n- `model`: 'cross-encoder/ms-marco-TinyBERT-L-2-v2' | 'BAAI/bge-reranker-base'\n- `device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)\n- `documents`: list[Any]\n- `texts`: None (optional)\n- `query`: str\n- `k`: int\n\nOUTPUTS\n- `result`: list[Any]",
          "enum": [
            "rerank"
          ],
          "markdownDescription": "**Inputs**\n- `model`: 'cross-encoder/ms-marco-TinyBERT-L-2-v2' | 'BAAI/bge-reranker-base'\n- `device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)\n- `documents`: list[Any]\n- `texts`: None (optional)\n- `query`: str\n- `k`: int\n\n**Outputs**\n- `result`: list[Any]\n\n---",
          "title": "Rerank Action",
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
          "description": "`model`: 'cross-encoder/ms-marco-TinyBERT-L-2-v2' | 'BAAI/bge-reranker-base'",
          "markdownDescription": "- `model`: 'cross-encoder/ms-marco-TinyBERT-L-2-v2' | 'BAAI/bge-reranker-base'\n\n---",
          "title": "Rerank Action Input"
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
          "description": "`device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)",
          "markdownDescription": "- `device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)\n\n---",
          "title": "Rerank Action Input"
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
          "description": "`documents`: list[Any]",
          "markdownDescription": "- `documents`: list[Any]\n\n---",
          "title": "Rerank Action Input"
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
          "description": "`texts`: None (optional)",
          "markdownDescription": "- `texts`: None (optional)\n\n---",
          "title": "Rerank Action Input"
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
          "description": "`query`: str",
          "markdownDescription": "- `query`: str\n\n---",
          "title": "Rerank Action Input"
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
          "description": "`k`: int",
          "markdownDescription": "- `k`: int\n\n---",
          "title": "Rerank Action Input"
        }
      },
      "required": [
        "action",
        "documents",
        "query"
      ],
      "title": "Rerank Action",
      "type": "object"
    },
    "retrieveActionInvocation": {
      "additionalProperties": false,
      "description": "INPUTS\n- `model`: 'sentence-transformers/all-mpnet-base-v2' | 'BAAI/bge-small-en-v1.5'\n- `device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)\n- `documents`: list[Any]\n- `texts`: None (optional)\n- `query`: str\n- `k`: int\n\nOUTPUTS\n- `result`: list[Any]",
      "markdownDescription": "**Inputs**\n- `model`: 'sentence-transformers/all-mpnet-base-v2' | 'BAAI/bge-small-en-v1.5'\n- `device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)\n- `documents`: list[Any]\n- `texts`: None (optional)\n- `query`: str\n- `k`: int\n\n**Outputs**\n- `result`: list[Any]",
      "properties": {
        "action": {
          "const": "retrieve",
          "description": "INPUTS\n- `model`: 'sentence-transformers/all-mpnet-base-v2' | 'BAAI/bge-small-en-v1.5'\n- `device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)\n- `documents`: list[Any]\n- `texts`: None (optional)\n- `query`: str\n- `k`: int\n\nOUTPUTS\n- `result`: list[Any]",
          "enum": [
            "retrieve"
          ],
          "markdownDescription": "**Inputs**\n- `model`: 'sentence-transformers/all-mpnet-base-v2' | 'BAAI/bge-small-en-v1.5'\n- `device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)\n- `documents`: list[Any]\n- `texts`: None (optional)\n- `query`: str\n- `k`: int\n\n**Outputs**\n- `result`: list[Any]\n\n---",
          "title": "Retrieve Action",
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
          "description": "`model`: 'sentence-transformers/all-mpnet-base-v2' | 'BAAI/bge-small-en-v1.5'",
          "markdownDescription": "- `model`: 'sentence-transformers/all-mpnet-base-v2' | 'BAAI/bge-small-en-v1.5'\n\n---",
          "title": "Retrieve Action Input"
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
          "description": "`device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)",
          "markdownDescription": "- `device`: 'cpu' | 'cuda' | 'mps' | 'tensorrt' (optional)\n\n---",
          "title": "Retrieve Action Input"
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
          "description": "`documents`: list[Any]",
          "markdownDescription": "- `documents`: list[Any]\n\n---",
          "title": "Retrieve Action Input"
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
          "description": "`texts`: None (optional)",
          "markdownDescription": "- `texts`: None (optional)\n\n---",
          "title": "Retrieve Action Input"
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
          "description": "`query`: str",
          "markdownDescription": "- `query`: str\n\n---",
          "title": "Retrieve Action Input"
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
          "description": "`k`: int",
          "markdownDescription": "- `k`: int\n\n---",
          "title": "Retrieve Action Input"
        }
      },
      "required": [
        "action",
        "documents",
        "query"
      ],
      "title": "Retrieve Action",
      "type": "object"
    },
    "scoreActionInvocation": {
      "additionalProperties": false,
      "description": "INPUTS\n- `mutated_response_output`: list\n- `expected_output`: str\n\nOUTPUTS\n- `scores`: list",
      "markdownDescription": "**Inputs**\n- `mutated_response_output`: list\n- `expected_output`: str\n\n**Outputs**\n- `scores`: list",
      "properties": {
        "action": {
          "const": "score",
          "description": "INPUTS\n- `mutated_response_output`: list\n- `expected_output`: str\n\nOUTPUTS\n- `scores`: list",
          "enum": [
            "score"
          ],
          "markdownDescription": "**Inputs**\n- `mutated_response_output`: list\n- `expected_output`: str\n\n**Outputs**\n- `scores`: list\n\n---",
          "title": "Score Action",
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
          "description": "`mutated_response_output`: list",
          "markdownDescription": "- `mutated_response_output`: list\n\n---",
          "title": "Score Action Input"
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
          "description": "`expected_output`: str",
          "markdownDescription": "- `expected_output`: str\n\n---",
          "title": "Score Action Input"
        }
      },
      "required": [
        "action",
        "mutated_response_output",
        "expected_output"
      ],
      "title": "Score Action",
      "type": "object"
    }
  },
  "additionalProperties": false,
  "properties": {
    "default_model": {
      "$ref": "#/$defs/ModelConfig_"
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
            "$ref": "#/$defs/execute_db_statementActionInvocation"
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
            "$ref": "#/$defs/get_db_schemaActionInvocation"
          },
          {
            "$ref": "#/$defs/get_urlActionInvocation"
          },
          {
            "$ref": "#/$defs/ocrActionInvocation"
          },
          {
            "$ref": "#/$defs/promptActionInvocation"
          },
          {
            "$ref": "#/$defs/scoreActionInvocation"
          },
          {
            "$ref": "#/$defs/retrieveActionInvocation"
          },
          {
            "$ref": "#/$defs/rerankActionInvocation"
          },
          {
            "$ref": "#/$defs/HintedLoop"
          }
        ]
      },
      "title": "Flow",
      "type": "object"
    },
    "default_output": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ],
      "default": null,
      "title": "Default Output"
    }
  },
  "required": [
    "default_model",
    "flow"
  ],
  "title": "HintedActionConfig",
  "type": "object"
}
