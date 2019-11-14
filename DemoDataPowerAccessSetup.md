# Accessing ICP4I DataPower instance network interfaces

When setting up DataPower instance in IBM Cloud Pak for Integration there are
two options available:
- use no template
  - DataPower is in default lock-down mode
  - none of Management Interfaces is enabled
  - no application traffic is enabled
- use restProxy template
  - with Web Management Interface enabled on default port (9090)
  - restProxy demo application is enabled on port 8443 and mapped to
    NodePort 30200

## Accessing ICP4I DataPower instance management interfaces

To use DataPower you will probably want to enable at least one of it's
management interfaces. Process of enablement of management interfaces is
described below.

### DataPower instance with no Management Interface enabled

In case you select no template DataPower will not be accessible at all, neither
through one of it's management interfaces neither will any application interface
be enabled nor exposed.

To enable DataPower management interface(s) you have to use oc / kubectl attach
command, for example:

```bash
$ oc get pods -n datapower
NAME                                       READY  STATUS   RESTARTS
dp-1-ibm-datapower-icp4i-756d999fbb-zzhv2  1/1    Running  13

$ oc attach -it datapower dp-1-ibm-datapower-icp4i-756d999fbb-zzhv2
login:
```

After you attach to DataPower you can login to DataPower CLI as admin/admin
(using default username/password) and enable Web Management Interface (and other
Management interfaces).

After you enable any of management interfaces you can enable other management
interfaces using enabled interface.

### DataPower instance with Web Management Interface enabled

In case you select restProxy template DataPower Web Management Interface
(HTTPS port 9090) will be enabled but will not be exposed in cluster and
sample restProxy application (HTTPS port 30200) will be enabled and exposed in
cluster.

To expose DataPower Management Interface ports you can use oc / kubectl
port-forward command. For example, to expose enabled Web & REST Management
Interfaces using default port on same ports on localhost you can use following
commands:

```bash
$ oc get pods -n datapower
NAME                                       READY  STATUS   RESTARTS
dp-1-ibm-datapower-icp4i-756d999fbb-zzhv2  1/1    Running  13

$ oc port-forward -n datapower dp-1-ibm-datapower-icp4i-756d999fbb-zzhv2
9090:9090 5554:5554
Forwarding from 127.0.0.1:9090 -> 9090
Forwarding from [::1]:9090 -> 9090
Forwarding from 127.0.0.1:5554 -> 5554
Forwarding from [::1]:5554 -> 5554
```

## Accessing ICP4I DataPower instance applications

After you enable some of network listeners on DataPower appliance, for example
HTTPS Handler it is not accessible from cluster before it is passed using
service object connected to DataPower instance. To add additional network ports
(in given example new port mapping is named "helloproxy-datapower") you can use
following commands:

```bash
$ oc get service -n datapower
NAME                      ...  PORT(S)
dp-1-ibm-datapower-icp4i  ...  8443:30200/TCP

$ oc get service dp-1-ibm-datapower-icp4i -n datapower -o yaml > tmp.yaml

$ vi tmp.yaml
```
```yaml
...
ports:
- name: helloproxy-datapower
  nodePort: 30201
  port: 20001
  protocol: TCP
  targetPort: 20001
- name: restproxy-datapower
  nodePort: 30200
  port: 8443
  protocol: TCP
  targetPort: 8443
...
```
```bash
$ oc apply -f tmp.yaml

$ oc get service -n datapower
NAME                      ...  PORT(S)
dp-1-ibm-datapower-icp4i  ...  20001:30201/TCP,8443:30200/TCP
```
After that you should be able to access your DataPower application using newly
defined network NodePort.
