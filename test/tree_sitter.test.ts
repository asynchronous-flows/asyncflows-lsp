/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { initQuery, initYamlParser, query_flows } from '../src/tree_sitter_queries/queries';

import * as assert from 'assert';
import Parser, {Point} from "tree-sitter";

describe('tree_sitter', () => {
 it('Searching for nodes', function () {
  const source = `
# debono.yaml

# Set the default model for the flow (can be overridden in individual actions)
default_model:
  model: claude-3-haiku-20240307
# De Bono's Six Thinking Hats is a powerful technique for creative problem-solving and decision-making.
flow:

  # The white hat focuses on the available information and facts about the problem.
  white_hat:
    action: prompt
    prompt:
      - heading: Problem
        var: query
      - text: |
          List all the factual information you know about the problem. 
          What data and numbers are available? 
          Identify any gaps in your knowledge and consider how you might obtain this missing information.

  # The red hat explores emotions, feelings, and intuitions about the problem.
  red_hat:
    action: prompt
    prompt:
      - heading: Problem
        var: query
      - text: |
          Express your feelings and intuitions about the problem without any need to justify them.
          What are your initial reactions? 
          How do you and others feel about the situation?

  # The black hat considers the risks, obstacles, and potential downsides of the problem.
  black_hat:
    action: prompt
    prompt:
      - heading: Problem
        var: query
      - text: |
          Consider the risks and challenges associated with the problem. 
          What are the potential downsides? 
          Try to think critically about the obstacles, and the worst-case scenarios.

  # The yellow hat focuses on the positive aspects, benefits, and opportunities of the problem.
  yellow_hat:
    action: prompt
    prompt:
      - heading: Problem
        var: query
      - text: |
          Focus on the positives and the potential benefits of solving the problem. 
          What are the best possible outcomes? 
          How can this situation be an opportunity for growth or improvement?

  # The green hat generates creative ideas, alternatives, and innovative solutions to the problem.
  green_hat:
    action: prompt
    prompt:
      - heading: Problem
        var: query
      - text: |
          Think creatively about the problem. 
          Brainstorm new ideas and alternative solutions. 
          How can you overcome the identified challenges in an innovative way?

  # The blue hat manages the thinking process, synthesizes insights, and outlines a plan of action.
  blue_hat:
    action: prompt
    prompt:
      - heading: Problem
        var: query
      - heading: White Hat
        link: white_hat.result
      - heading: Red Hat
        link: red_hat.result
      - heading: Black Hat
        link: black_hat.result
      - heading: Yellow Hat
        link: yellow_hat.result
      - heading: Green Hat
        link: green_hat.result
      - text: |
          Review and synthesize the information and ideas generated from the other hats. 
          Assess which ideas are most feasible and effective based on the facts (White Hat), emotions (Red Hat), risks (Black Hat), benefits (Yellow Hat), and creative solutions (Green Hat). 
          How can these insights be integrated into a coherent strategy? 
          Outline a plan with clear steps or actions, indicating responsibilities, deadlines, and milestones. 
          Consider how you will monitor progress and what criteria you will use to evaluate success.

default_output: blue_hat.result   
  `;
  const query = initQuery();
  const parser = initYamlParser();
  // const tree = parser.parse(source);
  // query_flows(source, query, tree, {row: 0, column: 0});
  assert.equal(true, false)});
 })


