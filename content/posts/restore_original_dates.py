import os
import re
import yaml
from datetime import datetime

def parse_existing_frontmatter(content):
    """Parse existing front matter from markdown content."""
    if not content.startswith('---'):
        return {}, content
    
    parts = content[3:].split('---', 1)
    if len(parts) < 2:
        return {}, content
    
    try:
        frontmatter = yaml.safe_load(parts[0].strip())
        body = parts[1].lstrip('\n')
        return frontmatter or {}, body
    except yaml.YAMLError:
        return {}, content

def extract_original_date(existing_fm, filename):
    """Extract the original publication date from various possible fields."""
    # Try to find date information in different fields
    date_fields = ['date_published', 'date_updated', 'date']
    
    for field in date_fields:
        if field in existing_fm and existing_fm[field]:
            date_value = existing_fm[field]
            
            # Handle different date formats
            if isinstance(date_value, str):
                try:
                    # Handle ISO datetime strings like "2025-06-04T13:07:52.000Z"
                    if 'T' in date_value:
                        date_obj = datetime.fromisoformat(date_value.replace('Z', '+00:00'))
                        return date_obj.strftime('%Y-%m-%d')
                    # Handle simple date strings like "2024-03-14"
                    elif len(date_value) >= 10 and date_value[:10].count('-') == 2:
                        return date_value[:10]
                except:
                    continue
            
            # Handle datetime objects
            elif hasattr(date_value, 'strftime'):
                return date_value.strftime('%Y-%m-%d')
    
    # If we can't find a date, try to extract from filename (if it had a date prefix originally)
    # This won't work since we already removed the dates, but keeping for completeness
    date_match = re.match(r'^(\d{4}-\d{2}-\d{2})', filename)
    if date_match:
        return date_match.group(1)
    
    # Default fallback
    return "2024-03-14"

def restore_date_in_frontmatter(filepath):
    """Restore the original date in a post's front matter."""
    filename = os.path.basename(filepath)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        existing_fm, body = parse_existing_frontmatter(content)
        
        if not existing_fm:
            print(f"No front matter found in {filename}")
            return False
        
        # Extract the original date
        original_date = extract_original_date(existing_fm, filename)
        
        # Check if we need to update the date
        current_date = existing_fm.get('date', '')
        if current_date == original_date:
            print(f"Date already correct for {filename}: {original_date}")
            return True
        
        # Update the date field
        existing_fm['date'] = original_date
        
        # Format the front matter
        lines = ['---']
        for key, value in existing_fm.items():
            lines.append(f'{key}: {value}')
        lines.append('---')
        
        new_front_matter = '\n'.join(lines)
        new_content = new_front_matter + '\n\n' + body
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"Updated {filename}: {current_date} -> {original_date}")
        return True
        
    except Exception as e:
        print(f"Error updating {filename}: {str(e)}")
        return False

def main():
    """Restore original dates for all posts."""
    posts_dir = '.'  # Current directory (content/posts)
    
    # Get all .md files
    md_files = [f for f in os.listdir(posts_dir) if f.endswith('.md')]
    
    print(f"Found {len(md_files)} markdown files")
    print("Restoring original publication dates...\n")
    
    success_count = 0
    for filename in md_files:
        filepath = os.path.join(posts_dir, filename)
        if restore_date_in_frontmatter(filepath):
            success_count += 1
    
    print(f"\nCompleted: {success_count}/{len(md_files)} files processed successfully")

if __name__ == "__main__":
    main() 