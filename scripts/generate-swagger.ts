import fs from 'fs';
import path from 'path';
import yaml from 'yamljs';
import { logger } from '../src/core/utils/logger';

interface ApiInfo {
  info: {
    title: string;
    version: string;
    description: string;
    contact: {
      name: string;
      email: string;
    };
  };
}

interface Server {
  url: string;
  description: string;
}

interface Servers {
  servers: Server[];
}

interface Tag {
  name: string;
  description: string;
}

interface Tags {
  tags: Tag[];
}

interface Security {
  security: Array<{ [key: string]: string[] }>;
}

interface PathDefinition {
  [path: string]: any;
}

interface Parameters {
  parameters: {
    [name: string]: any;
  };
}

interface Schemas {
  schemas: {
    [name: string]: any;
  };
}

interface SecuritySchemes {
  securitySchemes: {
    [name: string]: any;
  };
}

interface OpenAPISpec {
  openapi: string;
  info: ApiInfo['info'];
  servers: Server[];
  tags: Tag[];
  security: Security['security'];
  paths: PathDefinition;
  components: {
    securitySchemes: SecuritySchemes['securitySchemes'];
    parameters: Parameters['parameters'];
    schemas: {
      [name: string]: any;
    };
  };
}

async function generateSwagger(): Promise<void> {
  try {
    logger.info('🚀 Generating combined Swagger documentation...');

    // Read all component files
    const info: ApiInfo = yaml.load(path.join(__dirname, '../swagger/api/info.yaml'));
    const servers: Servers = yaml.load(path.join(__dirname, '../swagger/api/servers.yaml'));
    const tags: Tags = yaml.load(path.join(__dirname, '../swagger/api/tags.yaml'));
    const security: Security = yaml.load(path.join(__dirname, '../swagger/api/security.yaml'));

    // Read route files
    const healthRoutes: PathDefinition = yaml.load(path.join(__dirname, '../swagger/routes/health.yaml'));
    const authRoutes: PathDefinition = yaml.load(path.join(__dirname, '../swagger/routes/auth.yaml'));

    // Read component files
    const parameters: Parameters = yaml.load(path.join(__dirname, '../swagger/components/parameters/index.yaml'));
    const commonSchemas: Schemas = yaml.load(path.join(__dirname, '../swagger/components/schemas/index.yaml'));
    const userSchemas: Schemas = yaml.load(path.join(__dirname, '../swagger/components/schemas/user.yaml'));
    const securitySchemes: SecuritySchemes = yaml.load(path.join(__dirname, '../swagger/components/schemas/security.yaml'));

    // Combine everything into a single OpenAPI spec
    const combinedSpec: OpenAPISpec = {
      openapi: '3.0.0',
      ...info,
      ...servers,
      ...tags,
      ...security,
      paths: {
        ...healthRoutes,
        ...authRoutes,
      },
      components: {
        ...securitySchemes,
        ...parameters,
        schemas: {
          ...commonSchemas.schemas,
          ...userSchemas.schemas,
        },
      },
    };

    // Convert to YAML
    const yamlOutput: string = yaml.stringify(combinedSpec, 10, 2);

    // Write to index.yaml
    const outputPath: string = path.join(__dirname, '../swagger', 'index.yaml');
    fs.writeFileSync(outputPath, yamlOutput, 'utf8');

    logger.info('✅ Swagger documentation generated successfully!');
    logger.info(`📄 Output: ${outputPath}`);
    logger.info('📊 Stats:');
    logger.info(`   - Routes: ${Object.keys(combinedSpec.paths).length}`);
    logger.info(`   - Schemas: ${Object.keys(combinedSpec.components.schemas).length}`);
    logger.info(`   - Parameters: ${Object.keys(combinedSpec.components.parameters).length}`);
  } catch (error) {
    logger.error('❌ Error generating Swagger documentation:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      logger.error(error.stack);
    }
    process.exit(1);
  }
}

generateSwagger();
