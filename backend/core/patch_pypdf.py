import pypdf._font
from pypdf.generic import NameObject, ArrayObject, FloatObject, IndirectObject

# Store the original static method
original_parse_font_descriptor = pypdf._font.FontDescriptor._parse_font_descriptor

@staticmethod
def patched_parse_font_descriptor(font_kwargs, font_descriptor_obj):
    try:
        font_descriptor_dict = font_descriptor_obj.get_object() if isinstance(font_descriptor_obj, IndirectObject) else font_descriptor_obj
        if "/FontBBox" not in font_descriptor_dict:
            font_descriptor_dict[NameObject("/FontBBox")] = ArrayObject([
                FloatObject(-100.0), 
                FloatObject(-200.0), 
                FloatObject(1000.0), 
                FloatObject(900.0)
            ])
    except Exception as e:
        print(f"[PATCH] Error in patched _parse_font_descriptor: {e}")
    
    return original_parse_font_descriptor(font_kwargs, font_descriptor_obj)

# Apply the patch
pypdf._font.FontDescriptor._parse_font_descriptor = patched_parse_font_descriptor
print("[PATCH] Successfully monkey-patched pypdf FontBBox parsing.")
