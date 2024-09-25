## 1.0.2 (2024-09-25)

### Bugfixes

- Changed the method for handling resource paths by replacing the base URL directly instead of slicing it. This resolves errors that occurred, e.g., when using `https` base URLs.

## 1.0.1 (2024-09-13)

### Features

- Adds Subresource Integrity (SRI) to both local and external files.
- Only adds SRI if no integrity attribute is already specified.
- Provides options for choosing the integrity algorithm and specifying whether to add SRI to external resources.