grammar HelloWorld

entry Model:
    GenericAnnotations? 'http-endpoint' name=ID '{' (content+=HttpEndpointContent)* '}';

HttpEndpointContent:
    HttpEndpointDataSet | HttpEndpointAction;

HttpEndpointDataSet infers HttpEndpointDataSet:
    HttpEndpointAnnotations? public?='public'? 'data-set' name=ID '{'  '}';

fragment ActionKind:
    actionKind=('read' | 'write');

HttpEndpointAction infers HttpEndpointAction:
    HttpEndpointAnnotations? public?='public'? ActionKind 'action' name=ID '{'  '}';

fragment HttpEndpointAnnotations:
    annotations+=(LoggingAnnotation | TransactionAnnotation | RoutesAnnotation | GenericAnnotation)*;

LoggingAnnotation infers LoggingAnnotation:
    '@' name='logging' '(' level=LoggingLevel ')';

RoutesAnnotation infers RoutesAnnotation:
    '@' name='routes' '(' route=STRING ')';

TransactionAnnotation infers TransactionAnnotation:
    '@' name='transaction' ('(' enabled=('true' | 'false') ')')?;


LoggingLevel returns string:
    ID | 'action';

fragment GenericAnnotations:
    annotations+=Annotation*;

Annotation infers Annotation:
    GenericAnnotation;

GenericAnnotation infers GenericAnnotation:
    '@' name=ID ('(' value=('true'|'false') ')')?;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
