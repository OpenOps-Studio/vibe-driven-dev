#!/usr/bin/env python3
import json
import os
import re
import sys
import glob

# Configuration
CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'detectors_config.json')

class Color:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def load_config():
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

def run_audit(project_root):
    config = load_config()
    print(f"{Color.BLUE}=== Starting Code Audit ({project_root}) ==={Color.RESET}")
    
    violation_count = 0
    
    for rule_id, rule in config['rules'].items():
        print(f"Checking Rule: {rule_id} - {rule['description']}...")
        
        # 1. Resolve files
        files = glob.glob(os.path.join(project_root, rule['glob']), recursive=True)
        
        for file_path in files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    content = "".join(lines)
                
                # Check Type: Forbidden Patterns
                if 'forbidden_patterns' in rule:
                    for pattern in rule['forbidden_patterns']:
                        matches = re.finditer(pattern['regex'], content)
                        for match in matches:
                            # Calculate line number
                            line_no = content[:match.start()].count('\n') + 1
                            print(f"  {Color.RED}[FAIL]{Color.RESET} {file_path}:{line_no} -> {pattern['message']}")
                            violation_count += 1
                
                # Check Type: Line Count
                if rule.get('check_type') == 'line_count':
                    if len(lines) > rule['max_lines']:
                        print(f"  {Color.RED}[FAIL]{Color.RESET} {file_path} -> {rule['message']} (Current: {len(lines)})")
                        violation_count += 1
                        
            except Exception as e:
                pass # Ignore binary files or read errors

    print("-" * 30)
    if violation_count > 0:
        print(f"{Color.RED}Audit Failed: {violation_count} violations found.{Color.RESET}")
        sys.exit(1)
    else:
        print(f"{Color.GREEN}Audit Passed: No violations found.{Color.RESET}")
        sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 audit_engine.py <project_root>")
        sys.exit(1)
    run_audit(sys.argv[1])
